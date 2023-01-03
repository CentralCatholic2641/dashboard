import express, { Router } from "express";
import Scouting from "../models/Scouting.model.js";
import ScoutingSchedule from "../models/ScoutingSchedule.model.js";
import User from "../models/User.model.js";
import Cache from "../models/Cache.model.js";
import { requireAuth } from "../middleware/authentication.js";

const router = Router();
const tbaroot = `https://www.thebluealliance.com/api/v3`;

router.use(requireAuth(false));

router.get("/match/:match", async (req, res) => {
	const raw = await Scouting.find({ type: "match", match: req.params.match });
	const schedule = await ScoutingSchedule.findOne({
		event: req.params.match.substring(0, req.params.match.indexOf("_")),
	});

	let data = {};

	for (let i of raw) {
		data[i.team] = { ...JSON.parse(JSON.stringify(i)) };
		data[i.team].scouter = schedule.matches[req.params.match];
	}

	res.json(data);
});

router.get("/pit/:event/:team", async (req, res) => {
	let data = await Scouting.findOne({
		type: "pit",
		team: req.params.team,
		event: req.params.event,
	});

	if (data) {
		const schedule = await ScoutingSchedule.findOne({
			event: req.params.event.toLowerCase(),
		});

		data.scouter = schedule.pitscouting[req.params.team];
	}

	res.json(data);
});

router.delete("/match/:match", async (req, res) => {
	if (req.user.role > 1 && req.query.team && req.query.station) {
		await Scouting.findOneAndDelete({
			match: req.params.match,
			team: req.query.team,
		});
		let ss = await ScoutingSchedule.findOne({
			event: req.params.match.substring(0, req.params.match.indexOf("_")),
		});
		let match = ss.matches[req.params.match];
		match[req.query.station].submitted = false;
		await ScoutingSchedule.findOneAndUpdate({ event: req.params.match.substring(0, req.params.match.indexOf("_")) }, { matches: ss.matches });
		res.end();
	}
});

router.delete("/pit/:event", async (req, res) => {
	if (req.user.role > 1 && req.query.team && req.query.station) {
		await Scouting.findOneAndDelete({
			type: "pit",
			event: req.params.event,
			team: req.query.team,
		});
		let ss = await ScoutingSchedule.findOne({
			event: req.params.event,
		});
		ss.pitscouting[req.query.team].submitted = false;
		ss.markModified("pitscouting");
		await ScoutingSchedule.findOneAndUpdate({ event: req.params.match.substring(0, req.params.match.indexOf("_")) }, { pitscouting: ss.pitscouting });
		res.end();
	}
});

router.post("/match", async (req, res) => {
	if (await Scouting.exists({ type: "match", match: req.body.match })) {
		delete req.body._id;
		await Scouting.findOneAndReplace({ match: req.body.match }, req.body);
	} else {
		await Scouting.create(req.body);
	}
	let scouting = await ScoutingSchedule.findOne({ event: req.body.event });
	let match = scouting.matches[req.body.match];
	match[req.query.station] = {
		assigned: req.user.username,
		assignedName: req.user.shortname || req.user.name,
		submitted: true,
	};
	await ScoutingSchedule.findOneAndUpdate({ event: req.body.event }, { matches: scouting.matches });
	res.end();
});

router.post("/pit", async (req, res) => {
	if (
		await Scouting.exists({
			type: "pit",
			team: req.body.team,
			event: req.body.event,
		})
	) {
		delete req.body._id;
		await Scouting.findOneAndReplace({ type: "pit", team: req.body.team, event: req.body.event }, req.body);
	} else {
		await Scouting.create(req.body);
	}
	let scouting = await ScoutingSchedule.findOne({ event: req.body.event });
	scouting.pitscouting[`frc${req.body.team}`] = {
		assigned: req.user.username,
		assignedName: req.user.name,
		submitted: true,
	};
	scouting.markModified("pitscouting");
	await ScoutingSchedule.findOneAndUpdate({ event: req.body.event }, { pitscouting: scouting.pitscouting });
	res.end();
});

router.get("/schedule/:event", async (req, res) => {
	let ss = await ScoutingSchedule.findOne({ event: req.params.event });
	const users = await User.find({}, "username name includeInScouting");
	users.sort((a, b) => a.name.localeCompare(b.name));
	res.json({
		...JSON.parse(JSON.stringify(ss)),
		users,
	});
});

router.post("/schedule/:event", async (req, res) => {
	let scouting = await ScoutingSchedule.findOne({ event: req.params.event });
	let match = scouting.matches[req.body.match];
	if (!match) {
		scouting.matches[req.body.match] = {
			Red1: {},
			Red2: {},
			Red3: {},
			Blue1: {},
			Blue2: {},
			Blue3: {},
		};
		match = scouting.matches[req.body.match];
	}
	let selected;
	if (req.body.to != "") {
		let user = await User.findOne({ username: req.body.to });
		const submitted = match[req.body.station] ? match[req.body.station].submitted : false;
		selected = {
			assigned: req.body.to,
			assignedName: user.shortname || user.name,
			submitted,
		};
	} else {
		const submitted = match[req.body.station] ? match[req.body.station].submitted : false;
		selected = {
			assigned: "",
			assignedName: "",
			submitted,
		};
	}
	match[req.body.station] = selected;
	scouting.markModified("matches");
	res.json(await ScoutingSchedule.findOneAndUpdate({ event: req.params.event }, { matches: scouting.matches }));
});

router.post("/pitscouting/:event", async (req, res) => {
	let scouting = await ScoutingSchedule.findOne({ event: req.params.event });
	if (!scouting.pitscouting[req.body.team]) {
		scouting.pitscouting[req.body.team] = {};
	}
	if (req.body.to != "") {
		let user = await User.findOne({ username: req.body.to });
		scouting.pitscouting[req.body.team] = {
			assigned: req.body.to,
			assignedName: user.name,
			submitted: scouting.pitscouting[req.body.team] ? scouting.pitscouting[req.body.team].submitted : false,
		};
	} else {
		scouting.pitscouting[req.body.team] = {
			assigned: "",
			assignedName: "",
			submitted: scouting.pitscouting[req.body.team] ? scouting.pitscouting[req.body.team].submitted : false,
		};
	}
	scouting.markModified("pitscouting");
	res.json(await ScoutingSchedule.findOneAndUpdate({ event: req.params.event }, { pitscouting: scouting.pitscouting }));
});

router.post("/genmatch/:code", async (req, res) => {
	if (req.user.role > 1) {
		const stations = ["Red1", "Red2", "Red3", "Blue1", "Blue2", "Blue3"];
		let users = [];
		for (let user in req.body) {
			if (req.body[user] == true) users.push(await User.findOne({ username: user }));
		}

		let order = [];
		for (let user of users.filter((user, index) => index < 6)) {
			order.push(user);
		}

		const schedule = await Cache.getData(`${tbaroot}/event/${req.params.code}/matches`);
		let ss = await ScoutingSchedule.findOne({ event: req.params.code });
		let scouting = {};

		for (let match of schedule) {
			scouting[match.key] = {};

			for (let station of stations) {
				const user = users[stations.indexOf(station)];
				if (ss.matches[match.key][station] ? !ss.matches[match.key][station].submitted : true) {
					if (user) {
						scouting[match.key][station] = {
							assigned: user.username,
							assignedName: user.shortname || user.name,
							submitted: false,
						};
					} else {
						scouting[match.key][station] = {
							assigned: "",
							assignedName: "",
							submitted: false,
						};
					}
				} else {
					scouting[match.key][station] = ss.matches[match.key][station];
				}
			}
		}

		if (await ScoutingSchedule.exists({ event: req.params.code })) {
			ss = await ScoutingSchedule.findOneAndUpdate({ event: req.params.code }, { event: req.params.code, matches: scouting }, { returnOriginal: false });
		} else {
			ss = await ScoutingSchedule.create({
				event: req.params.code,
				matches: scouting,
				pitscouting: {},
			});
		}
		res.json(ss);
	} else res.sendStatus(403);
});

router.post("/genpit/:code", async (req, res) => {
	if (req.user.role > 1) {
		let users = [];
		for (let user in req.body) {
			if (req.body[user] == true) users.push(await User.findOne({ username: user }));
		}

		let order = [];
		for (let user of users.filter((user, index) => index < 6)) {
			order.push(user);
		}

		let teams = await Cache.getData(`${tbaroot}/event/${req.params.code}/teams`);
		teams = teams.sort((a, b) => a.team_number - b.team_number);

		let ss = await ScoutingSchedule.findOne({ event: req.params.code });

		let pitscouting = {};
		for (let team of teams) {
			pitscouting[team.key] = {};
			const user = order[teams.indexOf(team) % order.length];
			if (ss.pitscouting[team.key] ? !ss.pitscouting[team.key].submitted : true) {
				if (user) {
					pitscouting[team.key] = {
						assigned: user.username,
						assignedName: user.name,
						submitted: false,
					};
				}
			} else {
				pitscouting[team.key] = ss.pitscouting[team.key];
			}
		}

		if (await ScoutingSchedule.exists({ event: req.params.code })) {
			ss = await ScoutingSchedule.findOneAndUpdate({ event: req.params.code }, { event: req.params.code, pitscouting }, { returnOriginal: false });
		} else {
			ss = await ScoutingSchedule.create({
				event: req.params.code,
				pitscouting,
				matches: {},
			});
		}
		res.json(ss);
	} else res.sendStatus(403);
});

export default router;
