import { Router } from "express";
import { getVehiclesHandler } from "../controllers/vehicleController";
import {
	submitApplicationHandler,
	submitDealershipInquiryHandler,
	submitCarFinderHandler,
} from "../controllers/applicationController";
import { globalLimiter, submissionLimiter } from "../middleware/rateLimiters";
import { agentHandler } from "../controllers/agentController";

const router = Router();

// Public Endpoint
router.get("/vehicles", globalLimiter, getVehiclesHandler);

// Protected Endpoint (Rate Limited)
router.post("/application", submissionLimiter, submitApplicationHandler);
router.post(
	"/dealership-inquiry",
	submissionLimiter,
	submitDealershipInquiryHandler,
);
router.post("/car-finder", submissionLimiter, submitCarFinderHandler);

router.get("/agent", globalLimiter, agentHandler);

export default router;
