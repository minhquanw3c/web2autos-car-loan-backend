import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import apiRoutes from "./routes/api";
import { globalLimiter } from "./middleware/rateLimiters";
import { startVehicleSyncJob } from "./jobs";
import "dotenv/config";

const app = express();

// ==========================================
// 0. PROXY CONFIGURATION (The Fix)
// ==========================================
// This allows Express to read the 'X-Forwarded-For' header to get the real IP.
// Required for correct Rate Limiting and IP Filtering behind a proxy.
app.set("trust proxy", 1);

const PORT = 3000;

// ==========================================
// 1. CONFIGURATION
// ==========================================

const env = process.env.NODE_ENV || "production";

// Define allowed Frontend URLs for Browser Access
const allowedOrigins =
	env === "production"
		? ["https://inventory.web2autos.com", "https://app.gohighlevel.com"]
		: ["http://localhost:5173"];

// Define allowed IPs for Server-to-Server Access (Third-party)
const allowedIps: string[] = env === "production" ? [] : ["::1", "127.0.0.1"];

// Whitelisted User Agents (Optional but recommended for server-to-server)
const allowedUserAgents: string[] = [
	"(compatible; AITrainingBot/1.0; +https://services.leadconnectorhq.com/bot-info)",
];

// ==========================================
// 2. SECURITY MIDDLEWARE
// ==========================================

// B. IP Filter Middleware
// We place this BEFORE CORS to reject unauthorized server scripts immediately.
const ipFilterMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	// Only check IP if Origin is undefined (indicates a non-browser request)
	const origin = req.headers.origin;

	if (!origin) {
		// req.ip works if 'trust proxy' is set correctly.
		// Fallback ensures we get a string.
		const requestIp: string = req.ip || req.socket.remoteAddress || "";
		const userAgent = req.headers["user-agent"] || "";

		console.log(`Request IP: ${requestIp}`);
		console.log(`Request User Agent: ${userAgent}`);

		// Check if the IP is in the whitelist
		// if (!allowedIps.includes(requestIp)) {
		// 	// Explicitly return to stop execution
		// 	res.status(403).json({
		// 		error: "Access denied",
		// 	});
		// 	return;
		// }

		// 2. Check User-Agent (Optional extra check)
		// This ensures random scripts from the allowed IP (if shared) can't hit it easily
		// without knowing the correct UA string.
		if (
			env === "production" &&
			!allowedUserAgents.some((ua) => userAgent.includes(ua))
		) {
			res.status(403).json({
				error: "Access denied",
			});
			return;
		}
	}

	next();
};

// A. Helmet: Sets various HTTP headers to secure the app
app.use(helmet());
// Apply IP Filter globally
app.use(ipFilterMiddleware);

// C. Strict CORS
// Only allow requests from specific Frontend URLs OR non-browser tools (validated by IP filter above)
app.use(
	cors({
		origin: (origin, callback) => {
			// Case 1: Non-browser request (e.g., Postman, Server Scripts)
			// We allow this because we already validated the IP in the middleware above.
			if (!origin) {
				return callback(null, true);
			}

			// Case 2: Browser request
			// We must strictly check the domain against our whitelist.
			console.log(`Requested from origin: ${origin}`);
			if (allowedOrigins.indexOf(origin) === -1) {
				const msg = "Access denied";
				return callback(new Error(msg), false);
			}

			return callback(null, true);
		},
		methods: ["GET", "POST"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

// D. Global Rate Limiter
app.use(globalLimiter);

// E. JSON Parsing with limit
app.use(express.json({ limit: "10kb" }));

// ==========================================
// 3. ROUTES & JOBS
// ==========================================

// API Routes
app.use("/api", apiRoutes);

// Start Background Jobs (Cron)
// startVehicleSyncJob();

app.listen(PORT, () => {
	console.log(`🛡️  Secure Server running on http://localhost:${PORT}`);
});
