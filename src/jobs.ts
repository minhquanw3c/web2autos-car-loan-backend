import cron from "node-cron";
import { saveVehicles } from "./db";

// Mock function to simulate fetching from a real 3rd party API
const fetchFromThirdPartyAPI = async () => {
	// In production, use axios.get('https://api.provider.com/inventory')
	// Here we generate 1000 rows of dummy data
	console.log("🔄 Cron: Fetching data from 3rd party provider...");

	const makes = [
		"Toyota",
		"Honda",
		"Ford",
		"BMW",
		"Mercedes",
		"Tesla",
		"Nissan",
		"Kia",
	];
	const models = ["Sedan", "SUV", "Truck", "Coupe", "Hybrid"];
	const dummyData: {
		id: number;
		make: string;
		model: string;
		year: number;
		price: number;
		img: string;
		desc: string;
	}[] = [];

	for (let i = 1; i <= 1000; i++) {
		const make = makes[Math.floor(Math.random() * makes.length)];
		const model = models[Math.floor(Math.random() * models.length)];
		dummyData.push({
			id: i,
			make: make,
			model: `${make} ${model} ${2020 + Math.floor(Math.random() * 5)}`,
			year: 2020 + Math.floor(Math.random() * 5),
			price: 15000 + Math.floor(Math.random() * 60000),
			img: `https://placehold.co/600x400/1e293b/FFF?text=${make}+${model}`,
			desc: `A reliable ${make} with low mileage and single owner history.`,
		});
	}

	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 1500));
	return dummyData;
};

// The actual Job
export const startVehicleSyncJob = () => {
	// Run every day at midnight: '0 0 * * *'
	// For demo, we run it every 5 minutes: '*/5 * * * *'
	cron.schedule("*/5 * * * *", async () => {
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
