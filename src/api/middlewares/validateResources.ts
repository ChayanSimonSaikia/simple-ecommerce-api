import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { AnyZodObject } from "zod";

export const validateResources =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error: any) {
      next(new createHttpError.BadRequest(error));
    }
  };
