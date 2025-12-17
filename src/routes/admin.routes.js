import express from "express";
import {
  getPendingUmkm,
  approveUmkm,
  rejectUmkm,
} from "../controllers/admin.controller.js";
import {
  getOpenDisputes,
  resolveDispute,
} from "../controllers/admin.dispute.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

// hanya ADMIN
router.use(authMiddleware, roleMiddleware(["ADMIN"]));

// list UMKM pending
router.get("/umkm/pending", getPendingUmkm);

// approve UMKM
router.patch("/umkm/:id/approve", approveUmkm);

// reject UMKM
router.patch("/umkm/:id/reject", rejectUmkm);

router.get("/disputes", getOpenDisputes);
router.patch("/disputes/:id/resolve", resolveDispute);

export default router;
