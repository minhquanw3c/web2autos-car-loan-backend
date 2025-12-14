import { Request, Response } from "express";
import { getVehicles } from "../db";

export const getVehiclesHandler = async (req: Request, res: Response) => {
	try {
		const vehicles = await getVehicles();
		res.json(vehicles);
	} catch (error) {
		console.error("Vehicle fetch error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
