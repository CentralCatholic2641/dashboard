import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Config from "../models/Config.model.js";
import { jwt_secret } from "../config/secret.js";

function requireAuth(used_in_oobe) {
	return async (req, res, next) => {
		if (used_in_oobe) {
			const config = await Config.findOne({});
			if (config.initialized) {
				const token = req.cookies.jwt;

				if (token) {
					jwt.verify(token, jwt_secret, (err, decodedToken) => {
						if (err) {
							console.eror(err.message);
							res.sendStatus(401);
						} else {
							next();
						}
					});
				} else {
					res.sendStatus(401);
				}
			} else next();
		} else {
			const token = req.cookies.jwt;

			if (token) {
				jwt.verify(token, jwt_secret, (err, decodedToken) => {
					if (err) {
						console.eror(err.message);
						res.sendStatus(401);
					} else {
						next();
					}
				});
			} else {
				res.sendStatus(401);
			}
		}
	};
}

function getUserData(req, res, next) {
	const token = req.cookies.jwt;
	if (token) {
		jwt.verify(token, jwt_secret, async (err, decodedToken) => {
			if (err) {
				console.error(err);
				req.user = null;
				next();
			} else {
				let user = await User.findById(decodedToken.id);
				req.user = user;
				next();
			}
		});
	} else {
		req.user = null;
		next();
	}
}

export { requireAuth, getUserData };
