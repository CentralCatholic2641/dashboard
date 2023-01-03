import mongoose from "mongoose";

const ScoutingScheduleSchema = new mongoose.Schema(
	{
		event: String,
		pitscouting: mongoose.Mixed,
		matches: mongoose.Mixed,
	},
	{ collection: "scoutingschedule", timestamps: true }
);

const ScoutingSchedule = mongoose.model("scoutingschedule", ScoutingScheduleSchema);

export default ScoutingSchedule;
