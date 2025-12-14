import { Request, Response } from "express";
import { z } from "zod";
import { ApplicationSchema } from "../schemas/application";

export const submitApplicationHandler = async (req: Request, res: Response) => {
	try {
		// 1. Validate Input Data
		const validatedData = ApplicationSchema.parse(req.body);

		console.log(
			"📩 Processing Secure Application:",
			validatedData.personalinformation_email
		);

		// 2. Simulate Secure CRM Submission
		// In production: await axios.post(CRM_URL, validatedData, { headers: { Authorization: CRM_KEY } })

		await new Promise((resolve) => setTimeout(resolve, 2000)); // Mimic delay

		// Random success/fail simulation logic
		if (Math.random() < 0.1) throw new Error("CRM Connection Error");

		res.json({ success: true, refId: `REF-${Date.now()}` });
	} catch (error) {
		if (error instanceof z.ZodError) {
			// Validation Error
			console.warn("Validation Failed:", error.errors);
			return res.status(400).json({
				error: "Validation Failed",
				details: error.errors.map(
					(e) => `${e.path.join(".")}: ${e.message}`
				),
			});
		}

		console.error("Submission Error:", error);
		res.status(502).json({
			error: "Application processing failed. Please try again later.",
		});
	}
};
