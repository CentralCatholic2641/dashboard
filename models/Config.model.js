import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema(
	{
		team: Number,
		event: Boolean,
		initialized: Boolean,
		year: Number,
		cacheLength: String,
		currentEvent: String,
		pitMode: String,
		tbatoken: String,
		frctoken: String,
		code: String,
		status: String,
		version: String,
	},
	{ collection: "config", timestamps: true }
);

const Config = mongoose.model("config", ConfigSchema);

export default Config;
