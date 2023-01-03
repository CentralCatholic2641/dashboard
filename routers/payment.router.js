import { Router } from "express";
import Payment from "../models/Payment.model.js";
import User from "../models/User.model.js";
import { requireAuth } from "../middleware/authentication.js";
import dayjs from "dayjs";

const router = Router();
router.use(requireAuth(false));

router.get("/", async (req, res) => {
	let raw = await Payment.find();
	raw.sort((a, b) => dayjs(`${b.due}T00:00:00`) - dayjs(`${a.due}T00:00:00`));
	res.json(raw);
});

router.post("/", async (req, res) => {
	if (req.user.role > 2) {
		let data = req.body;

		data.members = {};
		const members = await User.find({ type: { $ne: "Mentor", $ne: "Sponsor" } });

		for (let i of members) {
			data.members[i._id] = {
				included: true,
				status: "Not paid",
			};
		}

		await Payment.create(data);
		res.json(await Payment.find());
	} else res.sendStatus(403);
});

router.get("/:id", async (req, res) => {
	res.json(await Payment.findById(req.params.id));
});

router.put("/:id", async (req, res) => {
	if (req.user.role > 2) {
		res.json(await Payment.findByIdAndUpdate(req.params.id, req.body));
	} else res.sendStatus(403);
});

export default router;
