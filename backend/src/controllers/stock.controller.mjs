import { Log } from "../models/Log.model.mjs";
import { Stock } from "../models/stocks.model.mjs";
import ApiError from "../utils/ApiError.mjs";
import ApiResponse from "../utils/ApiResponse.mjs";
import asyncHandler from "../utils/asyncHandler.mjs";

const addStock = asyncHandler(async (req, res) => {
	const { name, price, initialStock, minimumRequiredStock } = req.body;
	if (!(name && price && initialStock && minimumRequiredStock)) {
		throw new ApiError(404, "Missing information");
	}

	const stockExist = await Stock.findOne({ name });
	if (stockExist) {
		throw new ApiError(401, "Stock with the given name already exist");
	}

	const newStock = await Stock.create({
		name: name,
		price: price,
		quantity: initialStock,
		minimumRequiredStock: minimumRequiredStock,
	});

	if (!newStock) {
		throw new ApiError(500, "Failed to add Stock");
	}

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ stock: newStock },
				"Stock added successfully"
			)
		);
});

const updateStock = asyncHandler(async (req, res) => {
	const { price, name } = req.body;
	if (!name) {
		throw new ApiError(404, "Please provide the name of the stock");
	}
	if (!price) {
		throw new ApiError(404, "Price not found");
	}
	const stock = await Stock.findOne({ name });

	if (!stock) {
		throw new ApiError(404, "Stock with the given name is not found");
	}

	stock.price = price;
	await stock.save({ validateBeforeSave: false });

	return res
		.status(200)
		.json(
			new ApiResponse(200, { stock: stock }, "Price update successfully")
		);
});

const increaseStockLevel = asyncHandler(async (req, res) => {
	const { quantity, name } = req.body;
	if (!quantity) {
		throw new ApiError(404, "increment not found");
	}
	if (!name) {
		throw new ApiError(404, "Stock name not found");
	}
	const stock = await Stock.findOne({ name });
	if (!stock) {
		throw new ApiError(404, "Stock with the given name not found");
	}
	const prevQ = stock.quantity;
	stock.quantity = stock.quantity + quantity;
	const log = await Log.create({
		stockName: stock.name,
		operation: "Restock",
		preQauntity: prevQ,
		currQuantity: stock.quantity,
	});

	await stock.save({ validateBeforeSave: false });
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ stock: stock, updatedStockValue: stock.quantity },
				"Stock quantity has been incremented successfully"
			)
		);
});

const sellStock = asyncHandler(async (req, res) => {
	const { quantity, name } = req.body;
	if (!quantity) {
		throw new ApiError(404, "increment not found");
	}
	if (!name) {
		throw new ApiError(404, "Stock name not found");
	}
	const stock = await Stock.findOne({ name });
	if (!stock) {
		throw new ApiError(404, "Stock with the given name not found");
	}
	const prevQ = stock.quantity;
	stock.quantity = stock.quantity - quantity;
	if (stock.quantity <= 0) {
		throw new ApiError(403, "Can't sell! not enough stock are available");
	}

	const log = await Log.create({
		stockName: stock.name,
		operation: "Sell",
		preQauntity: prevQ,
		currQuantity: stock.quantity,
	});

	await stock.save({ validateBeforeSave: false });
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ stock: stock, updatedStockValue: stock.quantity },
				"Stock quantity has been sold successfully"
			)
		);
});

const getLogHistory = asyncHandler(async (req, res) => {
	const { name } = req.body;
	if (!name) {
		throw new ApiError(404, "Stock name not found");
	}

	const logs = await Log.find({ stockName: name });
	if (!logs || logs.length === 0) {
		throw new ApiError(404, "logs with given stock name not found");
	}

	return res
		.status(200)
		.json(
			new ApiResponse(200, { logs: logs }, "Successfully fetched logs")
		);
});

const stocksBelowMinimumReqLevel = asyncHandler(async (req, res) => {
	const stocks = await Stock.find({
		quantity: { $lt: stocksBelowMinimumReqLevel },
	});

	if (!stocks || stocks.length === 0) {
		throw new ApiError(404, "No information found");
	}

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ stocks },
				"Stocks that are below in there minimum required level are fetched successfully"
			)
		);
});

export {
	addStock,
	sellStock,
	increaseStockLevel,
	updateStock,
	getLogHistory,
	stocksBelowMinimumReqLevel,
};
