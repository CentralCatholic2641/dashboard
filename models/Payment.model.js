import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
	{
		title: String,
		type: String,
		due: String,
		value: Number,
		members: Object,
		notes: String,
	},
	{ collection: "payments", timestamps: true }
);

const Payment = mongoose.model("payment", PaymentSchema);

export default Payment;
