import { Router } from "express";
import Meeting from "../models/Meeting.model.js";
import { requireAuth } from "../middleware/authentication.js";
import dayjs from "dayjs";
import User from "../models/User.model.js";
import isBetween from "dayjs/plugin/isBetween.js";
dayjs.extend(isBetween);

const router = Router();
router.use(requireAuth(false));

router.get("/", async (req, res) => {
	let raw = await Meeting.find({});
	raw.sort((a, b) => dayjs(`${b.date}T${b.start}`) - dayjs(`${a.date}T${a.start}`));
	res.json(raw);
});

router.post("/", async (req, res) => {
	if (req.user.role > 2) {
		res.json(await Meeting.create(req.body));
	} else res.sendStatus(403);
});

router.put("/", async (req, res) => {
	if (req.user.role > 2) {
		const _id = req.body._id;
		delete req.body._id;
		res.json(await Meeting.findByIdAndUpdate(_id, req.body));
	} else res.sendStatus(403);
});

router.get("/get/:id", async (req, res) => {
	if (req.user.role > 2) {
		res.json(await Meeting.findById(req.params.id));
	} else res.sendStatus(403);
});

router.delete("/:id", async (req, res) => {
	if (req.user.role > 2) {
		await Meeting.findByIdAndRemove(req.params.id);
		res.end();
	} else res.sendStatus(403);
});

router.get("/current", async (req, res) => {
	const meetings = await Meeting.find();
	let current = false;
	meetings.find((e) => {
		const isBetween = dayjs().isBetween(`${e.date}T${e.start}:00-0500`, `${e.date}T${e.end}:00-0500`);
		if (isBetween) current = e;
	});
	res.send(current);
});

router.get("/toggle", async (req, res) => {
	if (req.user.role > 2) {
		const user = await User.findOne({ card: req.query.card });
		var meeting = JSON.parse(JSON.stringify(await Meeting.findById(req.query.meeting)));
		delete meeting._id;
		if (user) {
			if (meeting.attendance) {
				meeting.attendance[user._id] = true;
			} else {
				meeting.attendance = {};
				meeting.attendance[user._id] = true;
			}

			await Meeting.findOneAndReplace({ _id: req.query.meeting }, meeting);
			res.json({ user, meeting });
		} else {
			res.json({ error: "Invalid card" });
		}
	} else res.sendStatus(403);
});

router.get("/leaderboard", async (req, res) => {
	let users = await User.find({ includeInAttendance: true }, "name includeInAttendance type");
	let meetings = await Meeting.find();

	let data = [];
	for (let i of users) {
		data.push({
			_id: i._id,
			name: i.name,
			type: i.type,
			hours: 0,
			rawHours: 0,
			meetings: 0,
			bonus: 0,
		});
	}

	let possibleHours = 0;

	for (let j of meetings.filter((h) => dayjs().isAfter(`${h.date}T${h.start}`))) {
		const duration = dayjs(`${j.date}T${j.end}`).diff(`${j.date}T${j.start}`, "hour", true);
		if (!j.bonus) possibleHours += duration;
		for (let k in j.attendance) {
			if (j.attendance[k] === true) {
				const index = data.findIndex((l) => l._id == k);
				if (index >= 0) {
					data[index]["hours"] += duration;
					if (j.bonus) data[index]["bonus"] += 1;
					else data[index]["meetings"] += 1;
				}
			}
		}
	}

	data.sort((a, b) => b.hours - a.hours);

	for (let m of data) {
		m.rawHours = m.hours;
		m.hours = m.hours.toFixed(2);
	}

	let groups = {};
	for (let m of data) {
		if (!groups[m.hours]) groups[m.hours] = [];
		groups[m.hours].push(m);
	}

	let pos = 0;
	let newdata = [];
	for (let o in groups) {
		if (groups[o].length == 1) {
			groups[o][0].rank = Object.keys(groups).indexOf(o) + pos + 1;
		} else {
			for (let p of groups[o]) {
				groups[o][groups[o].indexOf(p)].rank = `T${Object.keys(groups).indexOf(o) + pos + 1}`;
			}
			pos += groups[o].length - 1;
		}
		groups[o] = groups[o].sort((a, b) => a.name.localeCompare(b.name));

		newdata.push(...groups[o]);
	}

	res.json({ leaderboard: newdata, users, possibleHours });
});

router.get("/leaderboard/:id", async (req, res) => {
	let users = await User.find({ includeInAttendance: true }, "name includeInAttendance");
	let meetings = await Meeting.find();

	let data = [];
	for (let i of users) {
		data.push({
			_id: i._id,
			name: i.name,
			hours: 0,
			rawHours: 0,
			bonus: 0,
			meetings: 0,
		});
	}

	let possibleHours = 0;

	for (let j of meetings.filter((h) => dayjs().isAfter(`${h.date}T${h.start}`))) {
		const duration = dayjs(`${j.date}T${j.end}`).diff(`${j.date}T${j.start}`, "hour", true);
		if (!j.bonus) possibleHours += duration;
		for (let k in j.attendance) {
			if (j.attendance[k] === true) {
				const index = data.findIndex((l) => l._id == k);
				if (index >= 0) {
					data[index]["hours"] += duration;
					if (j.bonus) data[index]["bonus"] += 1;
					else data[index]["meetings"] += 1;
				}
			}
		}
	}

	data.sort((a, b) => b.hours - a.hours);

	for (let m of data) {
		m.rawHours = m.hours;
		m.hours = m.hours.toFixed(2);
	}

	let groups = {};
	for (let m of data) {
		if (!groups[m.hours]) groups[m.hours] = [];
		groups[m.hours].push(m);
	}

	let pos = 0;
	let newdata = [];
	for (let o in groups) {
		if (groups[o].length == 1) {
			groups[o][0].rank = Object.keys(groups).indexOf(o) + pos + 1;
		} else {
			for (let p of groups[o]) {
				groups[o][groups[o].indexOf(p)].rank = `T${Object.keys(groups).indexOf(o) + pos + 1}`;
			}
			pos += groups[o].length - 1;
		}
		groups[o] = groups[o].sort((a, b) => a.name.localeCompare(b.name));

		newdata.push(...groups[o]);
	}

	res.json({
		leaderboard: newdata.find((i) => i._id == req.params.id),
		possibleHours,
	});
});

export default router;
