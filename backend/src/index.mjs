import dotenv from "dotenv";
import connectDB from "./db/connectDB.mjs";
import app from "./app.mjs";
dotenv.config();

const port = process.env.PORT;

connectDB()
	.then(() => {
		console.log("Starting server...");
		app.listen(port, () => {
			console.log("Server started successfully at " + port);
		});
	})
	.catch((err) => {
		console.err("Failed to start server...");
	});
