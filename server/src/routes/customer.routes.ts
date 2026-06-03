import { Router } from "express";
import { getCustomers } from "../controllers/customer.controller.js";
import { cacheMiddleware } from "../middleware/cache.middleware.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAdmin, cacheMiddleware("customers"), getCustomers);

export default router;
