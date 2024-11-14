import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		stockId: {
			type: String,
			required: true,
		},
		stockName: {
			type: String,
			required: true,
		},
		operation: {
			type: String,
			required: true,
		},
		preQauntity: {
			type: Number,
		},
		currQuantity: {
			type: Number,
		},
	},
	{
		timestamps: true,
	}
);

export const Log = mongoose.model("Log", logSchema);
