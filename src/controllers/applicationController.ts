import { Request, Response } from "express";
import { z } from "zod";
import { ApplicationSchema } from "../schemas/application";
import {
	DealershipInquirySchema,
	CarFinderSchema,
} from "../schemas/application";
import axios from "axios";

export const submitApplicationHandler = async (req: Request, res: Response) => {
	try {
		if (
			!process.env.GOOGLE_SCRIPT_URL ||
			!process.env.WEB2AUTOS_BACKEND_SECRET
		) {
			throw new Error("Missing envs.");
		}

		// 1. Validate Input Data
		const validatedData = ApplicationSchema.parse(req.body);

		console.log(
			"📩 Processing Secure Application:",
			validatedData.personalinformation_email,
		);

		// 2. Simulate Secure CRM Submission
		const resFromScriptApp = await axios.post(
			process.env.GOOGLE_SCRIPT_URL,
			{
				auth_token: process.env.WEB2AUTOS_BACKEND_SECRET,
				data: req.body,
				action: "standard_lead",
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const parsedRes = resFromScriptApp.data as {
			status: string;
			message: string;
			httpCode: number;
		};

		if (parsedRes.httpCode !== 200) {
			throw new Error("There are errors occured in Google App Script.");
		}

		res.json({
			success: true,
			message: "Application submitted successfully.",
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			// Validation Error
			console.warn("Validation Failed:", error.errors);
			return res.status(400).json({
				error: "Validation Failed",
				details: error.errors.map(
					(e) => `${e.path.join(".")}: ${e.message}`,
				),
			});
		}

		console.error("Submission Error:", error);
		res.status(502).json({
			error: "Application processing failed. Please try again later.",
		});
	}
};

export const submitCarFinderHandler = async (req: Request, res: Response) => {
	try {
		if (
			!process.env.GOOGLE_SCRIPT_URL ||
			!process.env.WEB2AUTOS_BACKEND_SECRET
		) {
			throw new Error("Missing envs.");
		}

		// 1. Validate Input Data
		const validatedData = CarFinderSchema.parse(req.body);

		console.log(
			"📩 Processing Car Finder Request:",
			validatedData.personal_email,
		);

		// 2. Simulate Secure CRM Submission
		const resFromScriptApp = await axios.post(
			process.env.GOOGLE_SCRIPT_URL,
			{
				auth_token: process.env.WEB2AUTOS_BACKEND_SECRET,
				data: req.body,
				action: "car_finder",
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const parsedRes = resFromScriptApp.data as {
			status: string;
			message: string;
			httpCode: number;
		};

		if (parsedRes.httpCode !== 200) {
			console.log(parsedRes.message);
			throw new Error("There are errors occured in Google App Script.");
		}

		res.json({
			success: true,
			message: "Car finder request submitted successfully.",
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			// Validation Error
			console.warn("Validation Failed:", error.errors);
			return res.status(400).json({
				error: "Validation Failed",
				details: error.errors.map(
					(e) => `${e.path.join(".")}: ${e.message}`,
				),
			});
		}

		console.error("Submission Error:", error);
		res.status(502).json({
			error: "Car finder processing failed. Please try again later.",
		});
	}
};

export const submitDealershipInquiryHandler = async (
	req: Request,
	res: Response,
) => {
	try {
		if (
			!process.env.GOOGLE_SCRIPT_URL ||
			!process.env.WEB2AUTOS_BACKEND_SECRET
		) {
			throw new Error("Missing envs.");
		}

		// 1. Validate Input Data
		const validatedData = DealershipInquirySchema.parse(req.body);

		console.log(
			"📩 Processing Dealership Inquiry:",
			validatedData.dealership_name,
		);

		// 2. Simulate Secure CRM Submission
		const resFromScriptApp = await axios.post(
			process.env.GOOGLE_SCRIPT_URL,
			{
				auth_token: process.env.WEB2AUTOS_BACKEND_SECRET,
				data: req.body,
				action: "dealership_inquiry",
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const parsedRes = resFromScriptApp.data as {
			status: string;
			message: string;
			httpCode: number;
		};

		if (parsedRes.httpCode !== 200) {
			console.log(parsedRes.message);
			throw new Error("There are errors occured in Google App Script.");
		}

		res.json({
			success: true,
			message: "Inquiry submitted successfully.",
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			// Validation Error
			console.warn("Validation Failed:", error.errors);
			return res.status(400).json({
				error: "Validation Failed",
				details: error.errors.map(
					(e) => `${e.path.join(".")}: ${e.message}`,
				),
			});
		}

		console.error("Submission Error:", error);
		res.status(502).json({
			error: "Inquiry processing failed. Please try again later.",
		});
	}
};
