import { Router } from "express";
import Config from "../models/Config.model.js";
import Cache from "../models/Cache.model.js";
import { requireAuth } from "../middleware/authentication.js";
import dayjs from "dayjs";
import shell from "shelljs";

const root = `https://frc-api.firstinspires.org/v3.0`;
const tbaroot = `https://www.thebluealliance.com/api/v3`;

const router = Router();
router.use(requireAuth(false));

router.post("/", async (req, res) => {
	if (req.user.role == 4) {
		let config = {};
		if (await Config.exists({})) {
			config = { ...JSON.parse(JSON.stringify(await Config.findOneAndUpdate({}, req.body))), events: [] };
		} else {
			config = {
				...JSON.parse(JSON.stringify(await Config.create(req.body))),
				events: [],
			};
		}
		config.events = await Cache.getData(`${tbaroot}/team/frc${config.team}/events/${config.year}/simple`);
		config.events.sort((a, b) => dayjs(a.start_date) - dayjs(b.start_date));
		res.json(config);
	} else res.sendStatus(403);
});

router.post("/import", async (req, res) => {});

router.delete("/flush", async (req, res) => {
	await Cache.deleteMany({});
	res.end();
});

router.post("/update", requireAuth(false), async (req, res) => {
	await shell.exec(`wget https://update.aidanliddy.com/dl/tms/${req.body.version}.zip`);

	await shell.exec(`./backup.sh && unzip -o ${req.body.version}.zip && rm ${req.body.version}.zip && pkill node && npm i && npm start`);
});

export default router;
