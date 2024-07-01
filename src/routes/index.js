import express from "express";
import dataRoutes from "./data.js";
import { saveMessage } from "../controllers/saveMessage.js";

const router = express.Router();

router.use("/data", dataRoutes);

router.post("/save-message", saveMessage);

export default router;
