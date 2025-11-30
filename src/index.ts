import express from "express";
import cors from "cors";
import { startVehicleSyncJob } from "./jobs";
import { getVehicles } from "./db";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ origin: "*" })); // Allow all for dev, restrict in prod
app.use(express.json());

// 1. Start Background Jobs
startVehicleSyncJob();

// 2. API: Get Vehicles (Reads from local DB cache, super fast)
app.get("/api/vehicles", async (req, res) => {
	try {
		const vehicles = await getVehicles();
		res.json(vehicles);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch vehicles" });
	}
});

// 3. API: Submit Application (Secure Proxy)
app.post("/api/application", async (req, res) => {
	const formData = req.body;

	console.log("📩 Received Application:", formData.email);

	// Validate (Basic example)
	if (!formData.ssn || !formData.email) {
		return res.status(400).json({ error: "Missing sensitive fields" });
	}

	try {
		// Here you would use AXIOS to POST to your CRM
		// await axios.post('https://crm.com/api', formData, { headers: { Authorization: process.env.CRM_KEY }})

		// Simulating CRM delay
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Randomly simulate failure for testing (10% chance)
		if (Math.random() < 0.1) throw new Error("CRM Connection Timeout");

		res.json({ success: true, refId: `REF-${Date.now()}` });
	} catch (error) {
		console.error("CRM Submission Error");
		res.status(502).json({ error: "Failed to submit to third-party CRM" });
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
