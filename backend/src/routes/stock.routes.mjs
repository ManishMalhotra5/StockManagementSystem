import { Router } from "express";

const router = Router();

import {
	addStock,
	updateStock,
	sellStock,
	getLogHistory,
	increaseStockLevel,
	stocksBelowMinimumReqLevel,
	salesReport,
	topSellingItems,
} from "../controllers/stock.controller.mjs";
router.route("/add").post(addStock);
router.route("/update/:id").put(updateStock);
router.route("/sell/:id").patch(sellStock);
router.route("/logs/:id").get(getLogHistory);
router.route("/restock/:id").patch(increaseStockLevel);
router.route("/low-stock").get(stocksBelowMinimumReqLevel);
router.route("/report/sales").get(salesReport);
router.route("/report/top-selling").get(topSellingItems);

export default router;
