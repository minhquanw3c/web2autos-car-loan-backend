export type DealershipListing = {
	id: string;
	heading: string;
	price: number;
	miles: number;
	inventory_type: string;
	stock_no: string;
	source: string;
	media: {
		photo_links: Array<string>;
	};
	vdp_url: string;
	dealer: {
		name: string;
		street: string;
		dealer_type: string;
	};
	build: {
		year: number;
		make: string;
		model: string;
		trim: string;
		version: string;
		body_type: string;
		vehicle_type: string;
		transmission: string;
		drivetrain: string;
		fuel_type: string;
		engine: string;
		engine_size: string;
		engine_block: string;
		doors: number;
		cylinders: number;
		overall_height: string;
		overall_width: string;
		std_seating: string;
		highway_mpg: number;
		city_mpg: number;
		powertrain_type: string;
	};
	price_change_percent: number;
	msrp: number;
	exterior_color: string;
	interior_color: string;
	base_int_color: string;
	base_ext_color: string;
	dom: number;
};

export type DealershipListingApiResponse = {
	num_found: number;
	listings: Array<DealershipListing>;
};

export type DealershipListingClientResponse = Omit<
	DealershipListing,
	"media" | "vdp_url" | "build"
> & {
	mediaUrls: string[];
	referenceUrl: string;
	year: number;
	make: string;
	model: string;
};
