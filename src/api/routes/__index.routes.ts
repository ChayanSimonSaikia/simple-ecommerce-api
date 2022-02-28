import { Application, Request, Response } from "express";
import user from "./user.routes";
import auth from "./auth.routes";
import product from "./product.routes";
import createHttpError from "http-errors";
import errorHandler from "../helpers/errorHandler";

const routes = (app: Application) => {
  app.use("/user", user);
  app.use("/auth", auth);
  app.use(product);
  // Page Not Found
  app.use((_req: Request, res: Response) => {
    throw new createHttpError.NotFound("404 Error, Page Not Found");
  });
  // Error Handler
  app.use(errorHandler);
};

export default routes;
