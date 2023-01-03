import mongoose from "mongoose";

const ScoutingSchema = new mongoose.Schema(
	{
		type: String,
		scouter: String,
		team: Number,
		event: String,
		match: String,
		auto: Object,
		teleop: Object,
		end: Object,
		post: Object,
		drivers: Object,
		robot: Object,
		image: String,
		comments: String,
	},
	{ collection: "scouting", timestamps: true }
);

const Scouting = mongoose.model("scouting", ScoutingSchema);

export default Scouting;
