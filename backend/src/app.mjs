import express from "express";
import stockRouter from "./routes/stock.routes.mjs";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("", stockRouter);

export default app;
