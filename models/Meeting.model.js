import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
	{
		name: String,
		date: String,
		start: String,
		end: String,
		attendance: Object,
		notes: String,
		includeInAttendance: Boolean,
		bonus: Boolean,
	},
	{ collection: "meetings", timestamps: true }
);

const Meeting = mongoose.model("meeting", MeetingSchema);

export default Meeting;
