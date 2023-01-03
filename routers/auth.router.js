import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Task from "../models/Task.model.js";
import User from "../models/User.model.js";
import { jwt_secret } from "../config/secret.js";
import { requireAuth } from "../middleware/authentication.js";

const router = Router();

const maxAge = 7 * 24 * 60 * 60;
function createToken(id) {
	return jwt.sign({ id }, jwt_secret, {
		expiresIn: maxAge,
	});
}

router.post("/login", async (req, res) => {
	let user = await User.findOne({ username: req.body.username });
	if (user) {
		const auth = await bcrypt.compare(req.body.password, user.password);
		if (auth) {
			if (req.query.sponsor == "true") {
				if (user.role == 100) {
					const token = createToken(user._id);
					if (req.body.sticky) {
						res.cookie("jwt", token, {
							maxAge: maxAge * 1000,
						});
					} else {
						res.cookie("jwt", token);
					}
					res.status(200).json({ user, jwt: token });
				} else {
					if (user.role.includes("admin"))
						res.json({
							error: "Administrators manage sponsors in the member portal",
						});
					else res.json({ error: "You are not a sponsor" });
				}
			} else {
				if (user.role != 100) {
					const token = createToken(user._id);
					const tasks = await Task.find({ assigned: user._id, $or: [{ status: "In Progress" }, { status: "Under Review" }] }, "title due subteam");
					if (req.body.sticky) {
						res.cookie("jwt", token, {
							maxAge: maxAge * 1000,
						});
					} else {
						res.cookie("jwt", token);
					}
					res.status(200).json({ user, jwt: token, tasks });
				} else {
					res.json({
						error: "You are not a member, please use the sponsor portal",
					});
				}
			}
		} else {
			res.json({ error: "Password is incorrect" });
		}
	} else {
		res.json({ error: "User does not exist" });
	}
});

router.get("/logout", (req, res) => {
	res.cookie("jwt", "", { maxAge: 1 });
	res.redirect("/");
});

router.post("/create", requireAuth(false), async (req, res) => {
	if (await User.findOne({ username: req.body.username })) {
		res.json({ error: { username: "Username already exists" } });
	} else {
		try {
			const salt = await bcrypt.genSalt();
			const password = await bcrypt.hash(req.body.password, salt);
			delete req.body.password;
			const user = await User.create({
				...req.body,
				password,
			});

			res.json(user);
		} catch (err) {
			res.json({ error: err });
		}
	}
});

router.get("/users", requireAuth(false), async (req, res) => {
	if (req.query.sponsor == "true") {
		if (req.user.role > 2) {
			let sponsors = await User.find({ role: 100 }, "name sponsor email phone");
			sponsors.sort((a, b) => a.sponsor.org.localeCompare(b.sponsor.org));
			res.json(sponsors);
		} else {
			let sponsors = await User.find({ role: 100, "sponsor.member": req.user.name }, "name sponsor email phone");
			sponsors.sort((a, b) => a.sponsor.org.localeCompare(b.sponsor.org));
			res.json(sponsors);
		}
	} else {
		let users = await User.find({ role: { $ne: 100 } });
		users.sort((a, b) => a.name.localeCompare(b.name));
		res.json(users);
	}
});

router.get("/email", requireAuth(false), async (req, res) => {
	if (req.query.sponsor == "true") {
		if (req.user.role > 2) {
			let sponsors = await User.find({ role: 100 }, "name sponsor email");
			sponsors.sort((a, b) => a.sponsor.org.localeCompare(b.sponsor.org));
			res.json(sponsors);
		} else {
			let sponsors = await User.find({ role: 100, "sponsor.member": req.user.name }, "name sponsor email");
			sponsors.sort((a, b) => a.sponsor.org.localeCompare(b.sponsor.org));
			res.json(sponsors);
		}
	} else {
		let users = await User.find({ role: { $ne: 100 } }, "name email parents role type position subteam");
		users.sort((a, b) => a.name.localeCompare(b.name));
		res.json(users);
	}
});

router.get("/users/:id", requireAuth(false), async (req, res) => {
	res.json(await User.findById(req.params.id, "-password"));
});

router.get("/verify", async (req, res) => {
	const token = req.cookies.jwt;
	if (token) {
		jwt.verify(token, jwt_secret, async (err, decodedToken) => {
			if (err) {
				res.cookie("jwt", "", { maxAge: 1 });
				res.sendStatus(403);
			} else {
				let user = await User.findById(decodedToken.id);
				if (user) {
					if (req.query.sponsor == "true") {
						if (user.role == 100) {
							res.json({
								valid: true,
								user,
							});
						} else {
							res.json({ valid: false });
						}
					} else {
						if (user.role != 100) {
							const tasks = await Task.find({ assigned: user._id, $or: [{ status: "In Progress" }, { status: "Under Review" }] }, "title due subteam");
							res.json({
								valid: true,
								user,
								tasks,
							});
						} else {
							res.json({ valid: false });
						}
					}
				}
			}
		});
	} else {
		res.json({ valid: false });
	}
});

router.delete("/:id", requireAuth(false), async (req, res) => {
	await User.findByIdAndDelete(req.params.id);
	res.json(await User.find({}));
});

router.put("/:id", requireAuth(false), async (req, res) => {
	if (req.query.password == "true") {
		let data = req.body;
		const salt = await bcrypt.genSalt();
		data.password = await bcrypt.hash(req.body.password, salt);
		await User.findByIdAndUpdate(req.params.id, data);
		res.json(await User.find({}));
	} else {
		await User.findByIdAndUpdate(req.params.id, req.body);
		res.json(await User.find({}));
	}
});

router.get("/checkCard", requireAuth(false), async (req, res) => {
	const user = await User.findOne({ card: req.query.card });
	if (user) res.json({ duplicate: true, user: user.name });
	else res.json({ duplicate: false, user: null });
});

export default router;
