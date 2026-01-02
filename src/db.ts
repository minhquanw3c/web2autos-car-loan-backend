import fs from "fs/promises";
import path from "path";

console.log(`Current working directory: ${process.cwd()}`);
const DB_PATH = path.join(process.cwd(), "src/data", "vehicles.json");

// Ensure data dir exists
const initDB = async () => {
	try {
		await fs.mkdir(path.join(__dirname, "src/data"), { recursive: true });
		// Check if file exists, if not create empty array
		try {
			await fs.access(DB_PATH);
		} catch {
			await fs.writeFile(DB_PATH, JSON.stringify([]));
		}
	} catch (error) {
		console.error("DB Init Error", error);
	}
};

export const saveVehicles = async (vehicles: any[]) => {
	await initDB();
	await fs.writeFile(DB_PATH, JSON.stringify(vehicles, null, 2));
	console.log(`💾 Saved ${vehicles.length} vehicles to local DB.`);
};

export const getVehicles = async () => {
	await initDB();
	const data = await fs.readFile(DB_PATH, "utf-8");
	return JSON.parse(data);
};
