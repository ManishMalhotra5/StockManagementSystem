import { Router } from "express";

const router = Router();

import {
	addStock,
	updateStock,
	sellStock,
	getLogHistory,
	increaseStockLevel,
	stocksBelowMinimumReqLevel,
} from "../controllers/stock.controller.mjs";
router.route("/items").post(addStock);
router.route("/items").put(updateStock);
router.route("/items/sell").patch(sellStock);
router.route("/items/logs").get(getLogHistory);
router.route("/items/restock").patch(increaseStockLevel);
router.route("/items/low-stock").get(stocksBelowMinimumReqLevel);
router.route("/reports/sales").get();
router.route("/report/top-selling").get();

export default router;
