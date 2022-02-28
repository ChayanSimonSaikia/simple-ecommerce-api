import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verifyToken } from "../helpers/verifyToken";
import config from "config";
import { findUserById } from "../services/auth.service";

export const requireLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get token
  const bearer = req.headers["authorization"];
  if (!bearer)
    return next(
      new createHttpError.Unauthorized(
        "You must login before proceeding further"
      )
    );
  const token = bearer.split(" ")[1];
  if (!token)
    return next(
      new createHttpError.Unauthorized("Invalid token, please login")
    );
  // Verify token
  try {
    const userId = await verifyToken(token, config.get<string>("accessSecret"));
    res.locals.userId = userId;
    return next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (
  req: Request,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  const userId = res.locals.userId;

  try {
    const user = await findUserById(userId);
    if (!user || !user.isAdmin)
      return next(
        new createHttpError.Forbidden("You're not authorized access this page")
      );

    next();
  } catch (error) {
    next(new createHttpError.InternalServerError());
  }
};

export const isVerified = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  try {
    const user = await findUserById(userId);
    if (!user) return new createHttpError.InternalServerError();
    if (!user.verified)
      throw new createHttpError.Unauthorized("Account must be verified");

    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
