import mongoose from "mongoose";

const RightsSchema = new mongoose.Schema({
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
	read: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
	write: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

const ResourceSchema = new mongoose.Schema(
	{
		filename: String,
		path: String,
		type: String,
		mime: String,
		rights: RightsSchema,
		size: String,
		to: String,
		file: String,
	},
	{ collection: "resources", timestamps: true }
);

const Resource = mongoose.model("resource", ResourceSchema);

export default Resource;
