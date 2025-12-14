import { Router } from "express";
import { getVehiclesHandler } from "../controllers/vehicleController";
import { submitApplicationHandler } from "../controllers/applicationController";
import { submissionLimiter } from "../middleware/rateLimiters";

const router = Router();

// Public Endpoint
router.get("/vehicles", getVehiclesHandler);

// Protected Endpoint (Rate Limited)
router.post("/application", submissionLimiter, submitApplicationHandler);

export default router;
