import mongoose from "mongoose";

const Subtask = new mongoose.Schema({
	title: String,
	completed: Boolean,
});

const TaskSchema = new mongoose.Schema(
	{
		title: String,
		subteam: String,
		description: String,
		checklist: [Subtask],
		status: String,
		peopleNeeded: Number,
		assigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
		due: String,
		tags: [String],
		primary: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
	},
	{ collection: "tasks", timestamps: true }
);

const Task = mongoose.model("task", TaskSchema);

export default Task;
