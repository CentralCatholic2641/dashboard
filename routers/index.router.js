import { Router } from "express";
import Config from "../models/Config.model.js";
import Cache from "../models/Cache.model.js";
import axios from "axios";
import { requireAuth } from "../middleware/authentication.js";
import dayjs from "dayjs";

const root = `https://frc-api.firstinspires.org/v3.0`;
const tbaroot = `https://www.thebluealliance.com/api/v3`;

const router = Router();

router.get("/", async (req, res) => {
	let config = {};
	if (await Config.exists({})) {
		config = { ...JSON.parse(JSON.stringify(await Config.findOne({}))), events: [] };
	} else {
		config = {
			...JSON.parse(
				JSON.stringify(
					await Config.create({
						initialized: false,
						team: process.env.TEAM,
						year: new Date().getFullYear(),
						cacheLength: 12,
						event: false,
					})
				)
			),
			events: [],
		};
	}
	config.events = await Cache.getData(`${tbaroot}/team/frc${config.team}/events/${config.year}/simple`);
	config.events.sort((a, b) => dayjs(a.start_date) - dayjs(b.start_date));
	res.json(config);
});

router.post("/frc", requireAuth(false), async (req, res) => {
	const config = await Config.findOne({}, "frctoken");
	axios.defaults.headers.common.Authorization = `Basic ${config.frctoken}`;
	axios
		.get(`${root}${req.body.target}`)
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			console.error(error);
			res.sendStatus(500);
		});
});

router.post("/tba", requireAuth(false), async (req, res) => {
	const config = await Config.findOne({}, "tbatoken");
	axios
		.get(`${tbaroot}${req.body.target}`, {
			headers: {
				"X-TBA-Auth-Key": config.tbatoken,
			},
		})
		.then((response) => {
			res.send(response.data);
		})
		.catch((error) => {
			console.error(error);
			res.sendStatus(500);
		});
});

export default router;
