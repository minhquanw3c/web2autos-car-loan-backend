import cron from "node-cron";
import { saveVehicles } from "./db";
import axios from "axios";
import { associatedDealerships } from "./constants/dealerships";
import {
	DealershipListing,
	DealershipListingApiResponse,
	DealershipListingClientResponse,
} from "./types/dealership_listing";

const fetchFromThirdPartyAPI = async () => {
	console.log("🔄 Cron: Fetching data from 3rd party provider...");

	const dealershipsData: Array<DealershipListingClientResponse> = [];

	for (const dealership of associatedDealerships.splice(0, 1)) {
		try {
			const res = await axios.get(
				`https://api.marketcheck.com/v2/dealerships/inventory?api_key=${process.env.MARKETCHECK_API_KEY}`,
				{
					headers: {
						Accept: "application/json",
					},
					params: {
						rows: 1500,
						start: 0,
						price_range: "1000-100000",
						dealer_id: dealership.id,
						owned: true,
					},
				},
			);

			const parsedRes = res.data as DealershipListingApiResponse;

			if (parsedRes.num_found > 0 && parsedRes.listings.length > 0) {
				parsedRes.listings.forEach((listing) => {
					try {
						const extractedMediaUrl =
							listing.media.photo_links.length > 0
								? [...listing.media.photo_links]
								: [];

						const vehicleToPush = {
							id: listing.id,
							heading: listing.heading,
							price: listing.price,
							miles: listing.miles,
							inventory_type: listing.inventory_type,
							stock_no: listing.stock_no,
							source: listing.source,
							mediaUrls: extractedMediaUrl,
							referenceUrl: listing.vdp_url,
							dealer: {
								name: listing.dealer.name,
								street: listing.dealer.street,
								dealer_type: listing.dealer.dealer_type,
							},
							...listing.build,
							price_change_percent: listing.price_change_percent,
							msrp: listing.msrp,
							interior_color: listing.interior_color,
							exterior_color: listing.exterior_color,
							base_int_color: listing.base_int_color,
							base_ext_color: listing.base_ext_color,
							dom: listing.dom,
						};

						dealershipsData.push(vehicleToPush);
					} catch (error) {
						console.error(
							`Failed to parse vehicle data with name: ${listing.heading} with id: ${listing.id}`,
							error,
						);
					}
				});
			}
		} catch (error) {
			console.error(
				`Failed to fetch vehicles data from dealership: ${dealership.name} with id: ${dealership.id}`,
				error,
			);
		}
	}

	console.log("🔄 Cron: Completed fetching data...");

	return dealershipsData;
};

// The actual Job
export const startVehicleSyncJob = () => {
	cron.schedule("0 0 * * *", async () => {
		try {
			const vehicles = await fetchFromThirdPartyAPI();
			await saveVehicles(vehicles);
		} catch (error) {
			console.error("Cron Job Failed:", error);
		}
	});

	// Also run immediately on startup if DB is empty
	console.log("⏰ Vehicle Sync Cron Job scheduled.");
	fetchFromThirdPartyAPI().then((data) => saveVehicles(data));
};
