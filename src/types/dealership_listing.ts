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
};

export type DealershipListingApiResponse = {
	num_found: number;
	listings: Array<DealershipListing>;
};

export type DealershipListingClientResponse = Omit<
	DealershipListing,
	"media"
> & {
	mediaUrl: string;
};
