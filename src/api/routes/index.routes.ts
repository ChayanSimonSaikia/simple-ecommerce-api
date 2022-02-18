import { Application, NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import errorHandler from "../helpers/errorHandler";

const routes = (app: Application) => {
  // Page Not Found
  app.use((_req: Request, res: Response) => {
    throw new createHttpError.NotFound("404 Error, Page Not Found");
  });
  // Error Handler
  app.use(errorHandler);
};

export default routes;
