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

	for (const dealership of associatedDealerships.slice(0, 1)) {
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
						car_type: "new",
						owned: true,
					},
				}
			);

			const parsedRes = res.data as DealershipListingApiResponse;

			if (parsedRes.num_found > 0 && parsedRes.listings.length > 0) {
				const filteredListings: Array<DealershipListingClientResponse> =
					parsedRes.listings.map((listing) => {
						const extractedMediaUrl =
							listing.media.photo_links.length > 0
								? listing.media.photo_links[0]
								: "";

						return {
							id: listing.id,
							heading: listing.heading,
							price: listing.price,
							miles: listing.miles,
							inventory_type: listing.inventory_type,
							stock_no: listing.stock_no,
							source: listing.source,
							mediaUrl: extractedMediaUrl,
						};
					});

				dealershipsData.push(...filteredListings);
			}
		} catch (error) {
			console.error(
				`Failed to fetch vehicles data from: ${dealership.name}`,
				error
			);
		}
	}

	console.log("🔄 Cron: Completed fetching data...");

	return dealershipsData;
};

// The actual Job
export const startVehicleSyncJob = () => {
	// Run every day at midnight: '0 0 * * *'
	// For demo, we run it every 5 minutes: '*/5 * * * *'
	cron.schedule("*/15 * * * *", async () => {
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
