import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import history from "connect-history-api-fallback";
import mongoose from "mongoose";
import dotenv from "dotenv";
import io from "socket.io-client";
import * as packagejson from "./package.json" assert { type: "json" };

import { getUserData } from "./middleware/authentication.js";
import Config from "./models/Config.model.js";
import Scouting from "./models/Scouting.model.js";

import indexRouter from "./routers/index.router.js";
import eventRouter from "./routers/event.router.js";
import teamRouter from "./routers/team.router.js";
import authRouter from "./routers/auth.router.js";
import scoutingRouter from "./routers/scouting.router.js";
import meetingRouter from "./routers/meeting.router.js";
import adminRouter from "./routers/admin.router.js";
import calendarRouter from "./routers/calendar.router.js";
import paymentRouter from "./routers/payment.router.js";
import taskRouter from "./routers/task.router.js";
import resourceRouter from "./routers/resource.router.js";
import axios from "axios";

const app = express();

dotenv.config();
app.use(express.json({ limit: "30mb" }));
app.use(cookieParser());
app.use(history());
app.use(cors());
app.use(getUserData);
function shouldCompress(req, res) {
	if (req.headers["x-no-compression"]) {
		return false;
	}
	return compression.filter(req, res);
}
app.use(compression({ filter: shouldCompress }));

app.use("/api", indexRouter);
app.use("/api/event", eventRouter);
app.use("/api/team", teamRouter);
app.use("/api/auth", authRouter);
app.use("/api/scouting", scoutingRouter);
app.use("/api/meeting", meetingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/task", taskRouter);
app.use("/api/resource", resourceRouter);
app.use("/api/content", express.static("./content"));
app.use("/", express.static("./dist"));

mongoose
	.connect(`mongodb://tms-${process.env.TEAM}-mongo:27017/tms-${process.env.TEAM}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.catch((error) => console.error(error));
mongoose.promise = global.Promise;
mongoose.set("returnOriginal", false);

let socket = io("https://frc2641.aidanliddy.com");

socket.on("connect", async () => {
	let config = await Config.findOne({});
	config.version = packagejson.default.version;
	await config.save();
	setTimeout(() => {
		if (config) {
			socket.emit("activate", config);
		}
	}, 500);
});

socket.on("status", async (status) => {
	console.log(status);
	await Config.findOneAndUpdate({}, { $set: { status } });
});

socket.on("sync", async () => {
	const config = await Config.findOne({});
	const all = await Scouting.find({}, "event");
	let comps = [];

	for (let i of all) {
		if (!comps.includes(i.event)) comps.push(i.event);
	}

	for (let i of comps) {
		const compData = await Scouting.find({ event: i });
		await axios.post(`https://frc2641.aidanliddy.com/api/instance/${config.code}/sync`, compData);
	}
});

app.listen(3000);
