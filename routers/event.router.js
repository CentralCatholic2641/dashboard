import { Router } from "express";
import Config from "../models/Config.model.js";
import Scouting from "../models/Scouting.model.js";
import dayjs from "dayjs";
import ScoutingSchedule from "../models/ScoutingSchedule.model.js";
import Cache from "../models/Cache.model.js";
import { requireAuth } from "../middleware/authentication.js";

const root = `https://frc-api.firstinspires.org/v3.0`;
const tbaroot = `https://www.thebluealliance.com/api/v3`;

const router = Router();
router.use(requireAuth(false));

router.get("/", async (req, res) => {
	let data = await Cache.getData(`${tbaroot}/events/${req.query.season}/simple`);
	const fulldata = await Cache.getData(`${tbaroot}/events/${req.query.season}`);

	data.sort((a, b) => dayjs(a.start_date) - dayjs(b.start_date));

	for (let i in data) {
		data[i].week = fulldata.find((j) => j.key == data[i].key).week;
	}

	let weeks = {
		champ: [],
		pre: [],
		post: [],
	};
	for (let i of data) {
		if (i.event_type == 3 || i.event_type == 4) {
			weeks.champ.push(i);
		} else if (i.event_type == 99) {
			weeks.post.push(i);
		} else if (i.event_type == 100) {
			weeks.pre.push(i);
		} else {
			if (!weeks[i.week + 1]) weeks[i.week + 1] = [];
			weeks[i.week + 1].push(i);
		}
	}

	if (weeks.pre.length == 0) delete weeks.pre;
	if (weeks.post.length == 0) delete weeks.post;

	res.json(weeks);
});

router.get("/:code", async (req, res) => {
	let data = {
		...(await Cache.getData(`${tbaroot}/event/${req.params.code}`)),
		schedule: [],
		alliances: await Cache.getData(`${tbaroot}/event/${req.params.code}/alliances`),
	};

	const schedule = await Cache.getData(`${tbaroot}/event/${req.params.code}/matches`);
	for (let i of schedule) {
		data.schedule.push({
			alliances: i.alliances,
			comp_level: i.comp_level,
			event_key: i.event_key,
			match_number: i.match_number,
			winning_alliance: i.winning_alliance,
			time: i.time,
			actual_time: i.actual_time,
			key: i.key,
		});
	}
	data.schedule = data.schedule.sort((a, b) => a.time - b.time);

	res.json(data);
});

router.get("/:code/schedule", async (req, res) => {
	let data = {
		schedule: [],
	};

	const event = await Cache.getData(`${tbaroot}/event/${req.params.code}/simple`);
	data.event_code = event.event_code;
	data.key = event.key;
	data.name = event.name;
	data.year = event.year;

	const schedule = await Cache.getData(`${tbaroot}/event/${req.params.code}/matches`);
	for (let i of schedule) {
		data.schedule.push({
			alliances: i.alliances,
			comp_level: i.comp_level,
			event_key: i.event_key,
			match_number: i.match_number,
			winning_alliance: i.winning_alliance,
			time: i.time,
			actual_time: i.actual_time,
			key: i.key,
		});
	}
	data.schedule = data.schedule.sort((a, b) => a.time - b.time);

	res.json(data);
});

router.get("/:code/schedule/:match", async (req, res) => {
	let data = {
		event: {},
		match: await Cache.getData(`${tbaroot}/match/${req.params.code}_${req.params.match}`),
	};

	const event = await Cache.getData(`${tbaroot}/event/${req.params.code}/simple`);
	data.event = {
		event_code: event.event_code,
		key: event.key,
		name: event.name,
		year: event.year,
	};

	res.json(data);
});

router.get("/:code/ranking", async (req, res) => {
	let data = {
		rankings: await Cache.getData(`${tbaroot}/event/${req.params.code}/rankings`),
		opr_data: await Cache.getData(`${tbaroot}/event/${req.params.code}/oprs`),
	};

	if (data.rankings) data.rankings = data.rankings.rankings;

	res.json(data);
});

router.get("/:code/teams", async (req, res) => {
	let data = {
		teams: [],
		opr_data: await Cache.getData(`${tbaroot}/event/${req.params.code}/oprs`),
	};

	const event = await Cache.getData(`${tbaroot}/event/${req.params.code}/simple`);
	data.event_code = event.event_code;
	data.key = event.key;
	data.name = event.name;
	data.year = event.year;

	const teams = await Cache.getData(`${tbaroot}/event/${req.params.code}/teams/simple`);
	for (let i of teams) {
		data.teams.push({
			team_number: i.team_number,
			nickname: i.nickname,
			key: i.key,
		});
	}
	data.teams = data.teams.sort((a, b) => a.team_number - b.team_number);

	const rankings = await Cache.getData(`${tbaroot}/event/${req.params.code}/rankings`);

	if (rankings)
		for (let i of data.teams) {
			i.rankings = rankings.rankings.find((j) => j.team_key.substring(3) == i.team_number);
		}

	res.json(data);
});

router.get("/:code/teams/short", async (req, res) => {
	let data = {
		teams: [],
	};

	const event = await Cache.getData(`${tbaroot}/event/${req.params.code}/simple`);
	data.event_code = event.event_code;
	data.key = event.key;
	data.name = event.name;
	data.year = event.year;

	const teams = await Cache.getData(`${tbaroot}/event/${req.params.code}/teams/simple`);
	for (let i of teams) {
		data.teams.push({
			team_number: i.team_number,
			nickname: i.nickname,
			key: i.key,
		});
	}
	data.teams = data.teams.sort((a, b) => a.team_number - b.team_number);

	res.json(data);
});

router.get("/:code/teams/:team", async (req, res) => {
	let data = {
		event: {},
		team: {
			schedule: [],
			scouting: {},
			scoutingschedule: {
				matches: {},
				pitscouting: {},
			},
			pitscouting: {},
		},
	};

	data.team.pitscouting = await Scouting.findOne({
		type: "pit",
		team: req.params.team,
		event: req.params.code.toLowerCase(),
	});

	const event = await Cache.getData(`${tbaroot}/event/${req.params.code}/simple`);
	data.event = {
		event_code: event.event_code,
		key: event.key,
		name: event.name,
		year: event.year,
	};

	const team = await Cache.getData(`${tbaroot}/team/frc${req.params.team}`);
	data.team.city = team.city;
	data.team.country = team.country;
	data.team.key = team.key;
	data.team.name = team.name;
	data.team.nickname = team.nickname;
	data.team.rookie_year = team.rookie_year;
	data.team.state_prov = team.state_prov;
	data.team.team_number = team.team_number;

	const schedule = await Cache.getData(`${tbaroot}/team/frc${req.params.team}/event/${req.params.code}/matches`);
	for (let i of schedule) {
		data.team.schedule.push({
			alliances: i.alliances,
			comp_level: i.comp_level,
			event_key: i.event_key,
			match_number: i.match_number,
			winning_alliance: i.winning_alliance,
			time: i.time,
			actual_time: i.actual_time,
			key: i.key,
		});
	}
	data.team.schedule = data.team.schedule.sort((a, b) => a.time - b.time);

	const rankings = await Cache.getData(`${tbaroot}/event/${req.params.code}/rankings`);

	if (rankings) {
		data.team.rankings = rankings.rankings.find((i) => i.team_key == `frc${req.params.team}`);
		data.team.totalteams = rankings.rankings.length;
	}

	data.team.stats = await getStats2022(req.params.team, req.params.code);

	const scoutingschedule = await ScoutingSchedule.findOne({
		event: req.params.code,
	});
	if (scoutingschedule) {
		data.team.scoutingschedule.event = scoutingschedule.event;
		for (let i of data.team.schedule) {
			const alliance = i.alliances.red.team_keys.includes(`frc${req.params.team}`) ? "Red" : "Blue";
			let station;

			if (alliance == "Red") station = i.alliances.red.team_keys.indexOf(`frc${req.params.team}`) + 1;
			else station = i.alliances.blue.team_keys.indexOf(`frc${req.params.team}`) + 1;

			if (scoutingschedule.matches[i.key]) {
				data.team.scoutingschedule.matches[i.key] = scoutingschedule.matches[i.key];
				data.team.scoutingschedule.matches[i.key] = {
					[`${alliance}${station}`]: {
						...data.team.scoutingschedule.matches[i.key][`${alliance}${station}`],
					},
				};
			}

			if (scoutingschedule.pitscouting[`frc${req.params.team}`]) data.team.scoutingschedule.pitscouting = scoutingschedule.pitscouting[`frc${req.params.team}`];
		}
	}

	const scoutingData = await Scouting.find({
		team: req.params.team,
	});
	for (let i of scoutingData) {
		data.team.scouting[i.match] = i;
	}

	let opr_data = await Cache.getData(`${tbaroot}/event/${req.params.code}/oprs`);
	if (opr_data)
		data.team.rankings.opr_data = {
			opr: opr_data.oprs["frc" + req.params.team],
			dpr: opr_data.dprs["frc" + req.params.team],
			ccwm: opr_data.ccwms["frc" + req.params.team],
		};

	res.json(data);
});

export async function getStats2022(team, event) {
	let scoutingData = await Scouting.find({ type: "match", team, event });

	let temp = {
		matchCount: 0,
		auto: {
			taxiCount: 0,
			taxiRate: 0,
			totalUpperScored: 0,
			totalUpperMissed: 0,
			totalLowerScored: 0,
			totalLowerMissed: 0,
			avgUpperScored: 0,
			avgUpperMissed: 0,
			avgLowerScored: 0,
			avgLowerMissed: 0,
		},
		teleop: {
			totalUpperScored: 0,
			totalUpperMissed: 0,
			totalLowerScored: 0,
			totalLowerMissed: 0,
			avgUpperScored: 0,
			avgUpperMissed: 0,
			avgLowerScored: 0,
			avgLowerMissed: 0,
		},
		end: {
			climb: {
				low: 0,
				mid: 0,
				high: 0,
				traversal: 0,
				failed: 0,
			},
			climbed: 0,
			climbRate: 0,
		},
		post: {
			totalSkill: 0,
			totalDefense: 0,
			totalDied: 0,
			totalTipped: 0,
			totalCard: 0,
			avgSkill: 0,
			avgDefense: 0,
			diedRate: 0,
			tippedRate: 0,
			cardRate: 0,
			avgSkillText: "",
			avgDefenseText: "",
		},
		comments: [],
	};

	for (let match of scoutingData) {
		temp.matchCount += 1;

		// Auto
		if (match.auto.taxied) temp.auto.taxiCount++;
		temp.auto.taxiRate = ((temp.auto.taxiCount / temp.matchCount) * 100).toFixed(0);

		temp.auto.totalUpperScored += parseInt(match.auto.upperScored);
		temp.auto.totalUpperMissed += parseInt(match.auto.upperMissed);
		temp.auto.totalLowerScored += parseInt(match.auto.lowerScored);
		temp.auto.totalLowerMissed += parseInt(match.auto.lowerMissed);

		temp.auto.avgUpperScored = (temp.auto.totalUpperScored / temp.matchCount).toFixed(0);
		temp.auto.avgUpperMissed = (temp.auto.totalUpperMissed / temp.matchCount).toFixed(0);
		temp.auto.avgLowerScored = (temp.auto.totalLowerScored / temp.matchCount).toFixed(0);
		temp.auto.avgLowerMissed = (temp.auto.totalLowerMissed / temp.matchCount).toFixed(0);

		// Teleop
		temp.teleop.totalUpperScored += parseInt(match.teleop.upperScored);
		temp.teleop.totalUpperMissed += parseInt(match.teleop.upperMissed);
		temp.teleop.totalLowerScored += parseInt(match.teleop.lowerScored);
		temp.teleop.totalLowerMissed += parseInt(match.teleop.lowerMissed);

		temp.teleop.avgUpperScored = (temp.teleop.totalUpperScored / temp.matchCount).toFixed(0);
		temp.teleop.avgUpperMissed = (temp.teleop.totalUpperMissed / temp.matchCount).toFixed(0);
		temp.teleop.avgLowerScored = (temp.teleop.totalLowerScored / temp.matchCount).toFixed(0);
		temp.teleop.avgLowerMissed = (temp.teleop.totalLowerMissed / temp.matchCount).toFixed(0);

		// Endgame
		if (match.end.climb == "Low") temp.end.climb.low += 1;
		if (match.end.climb == "Mid") temp.end.climb.mid += 1;
		if (match.end.climb == "High") temp.end.climb.high += 1;
		if (match.end.climb == "Traversal") temp.end.climb.traversal += 1;
		if (match.end.climb == "Failed") temp.end.climb.failed += 1;
		if (match.end.climb == "Did Not Attempt") temp.end.climb.failed += 1;
		if (match.end.climb != "None") temp.end.climbed += 1;
		temp.end.climbRate = ((temp.end.climbed / temp.matchCount) * 100).toFixed(0);

		// Postgame
		temp.post.totalSkill += parseInt(match.post.skill);
		temp.post.totalDefense += parseInt(match.post.defense);
		if (match.post.died) temp.post.totalDied += 1;
		if (match.post.tipped) temp.post.totalTipped += 1;
		if (match.post.card) temp.post.totalCard += 1;

		temp.post.avgSkill = (temp.post.totalSkill / temp.matchCount).toFixed(2);
		temp.post.avgDefense = (temp.post.totalDefense / temp.matchCount).toFixed(2);
		match.post.diedRate = ((temp.post.totalDied / temp.matchCount) * 100).toFixed(0);
		match.post.tippedRate = ((temp.post.totalTipped / temp.matchCount) * 100).toFixed(0);
		match.post.cardRate = ((temp.post.totalCard / temp.matchCount) * 100).toFixed(0);

		if (match.comments)
			temp.comments.push({
				match: match.match,
				comment: match.comments,
			});
	}

	if (temp.post.avgSkill < 1) temp.post.avgSkillText = "N/A";
	else if (temp.post.avgSkill < 2) temp.post.avgSkillText = "Poor";
	else if (temp.post.avgSkill < 3) temp.post.avgSkillText = "Mediocre";
	else if (temp.post.avgSkill < 4) temp.post.avgSkillText = "Average";
	else if (temp.post.avgSkill < 5) temp.post.avgSkillText = "Effective";
	else if (temp.post.avgSkill < 6) temp.post.avgSkillText = "Excellent";

	if (temp.post.avgDefense < 1) temp.post.avgDefenseText = "N/A";
	else if (temp.post.avgDefense < 2) temp.post.avgDefenseText = "Poor";
	else if (temp.post.avgDefense < 3) temp.post.avgDefenseText = "Mediocre";
	else if (temp.post.avgDefense < 4) temp.post.avgDefenseText = "Average";
	else if (temp.post.avgDefense < 5) temp.post.avgDefenseText = "Effective";
	else if (temp.post.avgDefense < 6) temp.post.avgDefenseText = "Excellent";

	return temp;
}

export default router;
