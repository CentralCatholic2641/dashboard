import axios from "axios";
import dayjs from "dayjs";
import mongoose from "mongoose";
import Config from "./Config.model.js";

const CacheSchema = new mongoose.Schema(
	{
		data: Object,
		src: String,
	},
	{
		collection: "cache",
		timestamps: true,
		statics: {
			getData: async (src) => {
				const config = (await Config.findOne({}, "cacheLength tbatoken frctoken")) || {};
				const cacheLength = config.cacheLength || "12";
				const fetchData = async () => {
					return axios
						.get(src, {
							headers: {
								"X-TBA-Auth-Key": config.tbatoken,
								Authorization: `Basic ${config.frctoken}`,
							},
						})
						.then(async (response) => {
							await mongoose.model("cache").create({
								data: response.data,
								src,
							});
							return response.data;
						})
						.catch((error) => console.error(error));
				};

				if ((await mongoose.model("cache").exists({ src })) != null) {
					const doc = await mongoose.model("cache").findOne({ src });
					if (dayjs(doc.createdAt).isBefore(dayjs().subtract(cacheLength, "hours"))) {
						await Cache.findByIdAndDelete(doc._id);
						return await fetchData();
					} else return doc.data;
				} else return await fetchData();
			},
		},
	}
);

const Cache = mongoose.model("cache", CacheSchema);

export default Cache;
