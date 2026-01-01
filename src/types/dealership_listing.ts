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
	};
	build: {
		year: number;
		make: string;
		model: string;
	};
};

export type DealershipListingApiResponse = {
	num_found: number;
	listings: Array<DealershipListing>;
};

export type DealershipListingClientResponse = Omit<
	DealershipListing,
	"media" | "vdp_url" | "build"
> & {
	mediaUrl: string;
	referenceUrl: string;
	year: number;
	make: string;
	model: string;
};
