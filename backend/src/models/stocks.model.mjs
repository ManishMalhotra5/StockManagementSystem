import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide stock name"],
			unique: true,
			lowercase: true,
		},
		price: {
			type: Number,
			required: [true, "Price not found"],
		},
		quantity: {
			type: Number,
		},
		minimumRequiredStock: {
			type: Number,
		},
	},
	{
		timestamps: true,
	}
);

export const Stock = mongoose.model("Stock", stockSchema);
