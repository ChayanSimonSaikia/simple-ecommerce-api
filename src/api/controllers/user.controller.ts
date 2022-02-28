import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { signAuthToken, signVerificationToken } from "../../utils/jwt";
import {
  changeEmailInput,
  changePasswordInput,
  CreateUserInput,
  logInUserInput,
} from "../schema/user.schema";
import { findUserById } from "../services/auth.service";
import {
  createUser,
  findUserByEmail,
  sendVerificationMail,
} from "../services/user.service";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  const input = req.body;
  try {
    const user = await createUser(input);
    // send Verification email
    const token = await signVerificationToken("5m", user.email);
    await sendVerificationMail(user.firstName, user.email, token);

    res.json({ message: "User created successfully" });
  } catch (error: any) {
    if (error.code === 11000)
      next(new createHttpError.Conflict(`${input.email} is already exists`));

    if (error.name === "Error")
      next(
        new createHttpError.BadRequest(
          `Could not send verification mail,make sure to use stable internet connection`
        )
      );

    next(error);
  }
};

export const logInUserHandler = async (
  req: Request<{}, {}, logInUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserByEmail(req.body.email);
    if (!user)
      throw new createHttpError.NotFound("Email/Password is incorrect");

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch)
      throw new createHttpError.NotFound("Email/Password is incorrect");

    const accessToken = await signAuthToken("access", user.id);
    const refreshToken = await signAuthToken("refresh", user.id);

    res.json({
      message: "User Logged In",
      tokens: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

export const changeEmailUserHandler = async (
  req: Request<{}, {}, changeEmailInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId;
    const user = await findUserById(userId);
    if (!user) throw new createHttpError.InternalServerError();

    user.email = req.body.email;
    await user.save();

    const token = await signVerificationToken("5m", user.email);
    await sendVerificationMail(user.firstName, user.email, token);
    res.json({ message: `Verification link send to ${req.body.email}` });
  } catch (error) {
    next(error);
  }
};

export const changePasswordUserHandler = async (
  req: Request<{}, {}, changePasswordInput>,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  try {
    const user = await findUserById(userId);
    if (!user) throw new createHttpError.InternalServerError();

    const isMatch = await user.comparePassword(req.body.currentPassword)
    if(!isMatch) throw new createHttpError.BadRequest("Incorrect password");

    user.password = req.body.newPassword;
    await user.save();
    res.json({ message: "Password has been changed" });
  } catch (error) {
    next(error);
  }
};
