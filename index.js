import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import history from "connect-history-api-fallback";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { getUserData } from "./middleware/authentication.js";

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

const app = express();

dotenv.config();
app.use(express.json({ limit: "15mb" }));
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

app.listen(3000);