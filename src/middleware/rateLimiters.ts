import rateLimit from "express-rate-limit";

// General protection against DDoS (e.g., 100 requests per 15 min)
export const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	message:
		"Too many requests from this IP, please try again after 15 minutes",
});

// Stricter Limiter for Submissions: Prevent spamming the Application form
export const submissionLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 hour window
	max: 5, // Limit each IP to 5 applications per hour
	message:
		"You have submitted too many applications. Please try again later.",
});
