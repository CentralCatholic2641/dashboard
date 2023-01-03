import { Router } from "express";
import Meeting from "../models/Meeting.model.js";
import { requireAuth } from "../middleware/authentication.js";
import dayjs from "dayjs";

const router = Router();
router.use(requireAuth(false));

router.get("/", async (req, res) => {
	let raw = await Meeting.find({}, "-attendance");
	raw.sort((a, b) => dayjs(`${b.date}T${b.start}`) - dayjs(`${a.date}T${a.start}`));
	res.json(raw);
});

export default router;
