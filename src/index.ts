import express from "express";
import cors from "cors";
import helmet from "helmet";
import apiRoutes from "./routes/api";
import { globalLimiter } from "./middleware/rateLimiters";
import { startVehicleSyncJob } from "./jobs";
import "dotenv/config";

const app = express();
const PORT = 3000;

// ==========================================
// 1. SECURITY MIDDLEWARE
// ==========================================

// A. Helmet: Sets various HTTP headers to secure the app
app.use(helmet());

const env = process.env.NODE_ENV || "production";
// B. Strict CORS: Only allow requests from your specific Frontend URL
const allowedOrigins =
	env === "production"
		? ["https://inventory.web2autos.com"]
		: ["http://localhost:5173"];

app.use(
	cors({
		origin: (origin, callback) => {
			console.log(`Current origin: ${origin}`);

			if (!origin || allowedOrigins.indexOf(origin) === -1) {
				const msg =
					"The CORS policy for this site does not allow access from the specified Origin.";
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		},
		methods: ["GET", "POST"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// C. Global Rate Limiter
app.use(globalLimiter);

// D. JSON Parsing with limit
app.use(express.json({ limit: "10kb" }));

// ==========================================
// 2. ROUTES & JOBS
// ==========================================

// API Routes
app.use("/api", apiRoutes);

// Start Background Jobs (Cron)
startVehicleSyncJob();

app.listen(PORT, () => {
	console.log(`🛡️  Secure Server running on http://localhost:${PORT}`);
});
