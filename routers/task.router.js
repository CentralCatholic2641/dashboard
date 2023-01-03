import { Router } from "express";
import Task from "../models/Task.model.js";
import { requireAuth } from "../middleware/authentication.js";

const router = Router();
router.use(requireAuth(false));

router.get("/", async (req, res) => {
	let tasks = await Task.find();
	tasks.sort((a, b) => a.title.localeCompare(b.title));
	res.json(tasks);
});

router.post("/", async (req, res) => {
	if (req.user.role == 4) res.json(await Task.create(req.body));
	else res.sendStatus(403);
});

router.put("/:id", async (req, res) => {
	res.json(await Task.findByIdAndUpdate(req.params.id, req.body));
});

router.delete("/:id", async (req, res) => {
	res.json(await Task.findByIdAndDelete(req.params.id));
});

export default router;
