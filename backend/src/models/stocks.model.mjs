import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			unique: [true, "Stock ID has to be unique"],
			required: [true, "Stock ID is required"],
			lowercase: true,
		},
		name: {
			type: String,
			required: [true, "Please provide stock name"],
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
