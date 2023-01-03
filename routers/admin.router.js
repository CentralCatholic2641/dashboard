import { Router } from "express";
import Config from "../models/Config.model.js";
import Cache from "../models/Cache.model.js";
import { requireAuth } from "../middleware/authentication.js";

const router = Router();

router.post("/", requireAuth(true), async (req, res) => {
	const config = await Config.findOne({}, "initialized");
	if (!config.initialized) res.json(await Config.findOneAndUpdate({}, req.body));
	else {
		if (req.user.role == 4) res.json(await Config.findOneAndReplace({}, req.body));
		else res.sendStatus(403);
	}
});

router.post("/import", requireAuth(false), async (req, res) => {});

router.delete("/flush", requireAuth(false), async (req, res) => {
	await Cache.deleteMany({});
	res.end();
});

export default router;
