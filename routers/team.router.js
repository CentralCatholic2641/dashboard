import { Router } from "express";
import Cache from "../models/Cache.model.js";
import { requireAuth } from "../middleware/authentication.js";
import dayjs from "dayjs";

// const root = `https://frc-api.firstinspires.org/v3.0`;
const tbaroot = `https://www.thebluealliance.com/api/v3`;

const router = Router();
router.use(requireAuth(false));

router.get("/", async (req, res) => {
	res.json(await Cache.getData(`${tbaroot}/teams/${req.query.season}/${req.query.page}/simple`));
});

router.get("/:team", async (req, res) => {
	let data = {
		...(await Cache.getData(`${tbaroot}/team/${req.params.team}`)),
		social: await Cache.getData(`${tbaroot}/team/${req.params.team}/social_media`),
		events: await Cache.getData(`${tbaroot}/team/${req.params.team}/events/${req.query.season}`),
		statuses: await Cache.getData(`${tbaroot}/team/${req.params.team}/events/${req.query.season}/statuses`),
	};

	data.events.sort((a, b) => dayjs(a.start_date) - dayjs(b.start_date));

	res.json(data);
});

export default router;
