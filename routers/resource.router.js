import { Router } from "express";
import Resource from "../models/Resource.model.js";
import { requireAuth } from "../middleware/authentication.js";

const router = Router();
router.use(requireAuth(false));

router.get("/:path", async (req, res) => {
	Resource.find({ path: decodeURIComponent(req.params.path) })
		.populate("rights.owner", "name")
		.exec(async (error, raw) => {
			if (error) console.error(error);
			raw.sort((a, b) => a.filename.localeCompare(b.filename));
			res.json(raw);
		});
});

router.get("/:path/:filename", async (req, res) => {
	res.json(await Resource.findOne({ path: decodeURIComponent(req.params.path), filename: decodeURIComponent(req.params.filename) }));
});

router.delete("/:id", async (req, res) => {
	const deleted = await Resource.findByIdAndDelete(req.params.id);
	if (deleted.type == "Folder") {
		const all = await Resource.find();
		for (let i of all) {
			if (i.path.includes(deleted.path + "/" + deleted.filename)) await Resource.findByIdAndDelete(i._id);
		}
	}
	res.end();
});

router.post("/", async (req, res) => {
	await Resource.create(req.body);
	res.end();
});

export default router;
