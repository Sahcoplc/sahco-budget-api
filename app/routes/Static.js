import { fetch } from "../controllers/Static.js";
import express from "express";

const router = express.Router()

router.get("/", fetch);

export default router