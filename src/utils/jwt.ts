import JWT, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import config from "config";
import createHttpError from "http-errors";
import client from "./redis";

export const signAuthToken = (
  role: "access" | "refresh",
  sub: string
): Promise<string> => {
  /* Arguments */
  const payload: JwtPayload = {};
  const secret: Secret =
    role === "access"
      ? config.get<string>("accessSecret")
      : config.get<string>("refreshSecret");
  const options: SignOptions = {
    subject: sub,
    expiresIn: role === "access" ? "1h" : "30d",
  };

  return new Promise((resolve, reject) => {
    return JWT.sign(payload, secret, options, (err, token) => {
      if (err) return reject(new createHttpError.InternalServerError());
      if (!token) return reject(new createHttpError.InternalServerError());

      if (role === "refresh")
        client
          .SETEX(sub, 60 * 60 * 24 * 30, token)
          .catch((err) => console.log(err));

      resolve(token);
    });
  });
};

export const signVerificationToken = (
  expire: string | "5m",
  sub: string
): Promise<string> => {
  const payload: JwtPayload = {};
  const secret: Secret = config.get<string>("emailSecret");
  const options: SignOptions = {
    subject: sub,
    expiresIn: expire,
  };

  return new Promise((resolve, reject) => {
    return JWT.sign(payload, secret, options, (err, token) => {
      if (err) return reject(new createHttpError.InternalServerError());
      if (!token) return reject(new createHttpError.InternalServerError());
      resolve(token);
    });
  });
};

export const signResetToken = (
  sub: string,
  currentPassword: string,
  expire: string | "5m"
): Promise<string> => {
  const payload: JwtPayload = {};
  const newSecret: Secret =
    config.get<string>("passwordSecret") + currentPassword;
  const options: SignOptions = {
    subject: sub,
    expiresIn: expire,
  };

  return new Promise((resolve, reject) => {
    return JWT.sign(payload, newSecret, options, (err, token) => {
      if (err) return reject(new createHttpError.InternalServerError());
      if (!token) return reject(new createHttpError.InternalServerError());
      resolve(token);
    });
  });
};
