import { Log } from "../models/Log.model.mjs";
import { Stock } from "../models/stocks.model.mjs";
import ApiError from "../utils/ApiError.mjs";
import ApiResponse from "../utils/ApiResponse.mjs";
import asyncHandler from "../utils/asyncHandler.mjs";
import { v4 as uuid } from "uuid";

const addStock = asyncHandler(async (req, res) => {
	const { name, price, initialStock, minimumRequiredStock, id } = req.body;
	if (!(id && name && price && initialStock && minimumRequiredStock)) {
		throw new ApiError(404, "Missing information");
	}

	const stockExist = await Stock.findOne({ id });
	if (stockExist) {
		throw new ApiError(401, "Stock with the given ID already exist");
	}

	const newStock = await Stock.create({
		id: id,
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
	const { id } = req.params;
	const { price, name } = req.body;
	if (!id) {
		throw new ApiError(404, "Please provide the name of the stock");
	}
	if (!price) {
		throw new ApiError(404, "Price not found");
	}
	const stock = await Stock.findOne({ id });

	if (!stock) {
		throw new ApiError(404, "Stock with the given name is not found");
	}

	stock.price = price;

	if (name) {
		stock.name = name;
	}

	await stock.save({ validateBeforeSave: false });

	return res
		.status(200)
		.json(
			new ApiResponse(200, { stock: stock }, "Price update successfully")
		);
});

const increaseStockLevel = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { quantity } = req.body;
	if (!quantity) {
		throw new ApiError(404, "increment not found");
	}
	if (!id) {
		throw new ApiError(404, "Stock ID not found");
	}
	const stock = await Stock.findOne({ id });
	if (!stock) {
		throw new ApiError(404, "Stock with the given name not found");
	}
	const prevQ = stock.quantity;
	stock.quantity = stock.quantity + quantity;
	const logId = uuid();
	const log = await Log.create({
		id: logId,
		stockId: stock.id,
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
	const { id } = req.params;
	const { quantity } = req.body;
	if (!quantity) {
		throw new ApiError(404, "increment not found");
	}
	if (!id) {
		throw new ApiError(404, "Stock name not found");
	}
	const stock = await Stock.findOne({ id });
	if (!stock) {
		throw new ApiError(404, "Stock with the given name not found");
	}
	const prevQ = stock.quantity;
	stock.quantity = stock.quantity - quantity;
	if (stock.quantity <= 0) {
		throw new ApiError(403, "Can't sell! not enough stock are available");
	}

	const logId = uuid();

	const log = await Log.create({
		id: logId,
		stockId: stock.id,
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
	const { id } = req.params;
	if (!id) {
		throw new ApiError(404, "Stock ID not found");
	}

	const logs = await Log.find({ stockId: id });
	if (!logs || logs.length === 0) {
		throw new ApiError(404, "logs with given stock id not found");
	}

	return res
		.status(200)
		.json(
			new ApiResponse(200, { logs: logs }, "Successfully fetched logs")
		);
});

const stocksBelowMinimumReqLevel = asyncHandler(async (req, res) => {
	const stocks = await Stock.find({
		$expr: { $lt: ["$quantity", "$minimumRequiredStock"] },
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
