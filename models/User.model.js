import mongoose from "mongoose";

const ParentSchema = new mongoose.Schema({
	name: String,
	phone: String,
	email: String,
	address: String,
	relationship: String,
});

const MembersPageState = new mongoose.Schema({
	filter: String,
	columns: Object,
});

const PageState = new mongoose.Schema({
	members: MembersPageState,
});

const UserSchema = new mongoose.Schema(
	{
		username: String,
		password: String,
		name: String,
		shortname: String,
		fullname: String,
		role: Number,
		address: String,
		email: String,
		phone: String,
		dob: String,
		type: String,
		subteam: String,
		position: String,
		notes: String,
		parents: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
		includeInAttendance: Boolean,
		includeInScouting: Boolean,
		resetPasswordOnNextLogin: Boolean,
		locked: Boolean,
		parents: [ParentSchema],
		sponsor: Object,
		allergies: String,
		pagestate: PageState,
	},
	{
		collection: "users",
		timestamps: true,
	}
);

const User = mongoose.model("user", UserSchema);

export default User;
