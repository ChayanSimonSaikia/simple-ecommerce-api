require("dotenv").config();
import express, { Application } from "express";
import cors from "cors";
import config from "config";
import routes from "./api/routes/__index.routes";
import connectToMongo from "./utils/db.connect";
import bodyParser from "body-parser";

const app: Application = express();
app.use(cors({ origin: "*" }));

app.use(bodyParser.urlencoded({ extended: true }));

const port = config.get<string>("port") || 3000;
app.listen(port, () => {
  console.log(`Server is running on PORT:${port}`);
  connectToMongo(); // MongoDB connection
  routes(app); // routes
});
