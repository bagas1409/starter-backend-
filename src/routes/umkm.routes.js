import express from "express";
import { createUmkmProfile } from "../controllers/umkm.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/profile",
  authMiddleware,
  roleMiddleware(["UMKM"]),
  createUmkmProfile
);

export default router;
