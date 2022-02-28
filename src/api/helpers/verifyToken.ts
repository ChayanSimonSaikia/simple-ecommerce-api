import createHttpError from "http-errors";
import JWT from "jsonwebtoken";

export const verifyToken = (token: string, secret: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    return JWT.verify(token, secret, (err, payload) => {
      if (err) {
        const message =
          err.name === "TokenExpiredError"
            ? "Session expired, please retry"
            : "Unauthorized";
        return reject(new createHttpError.Unauthorized(message));
      }
      if (!payload) return reject(new createHttpError.Unauthorized());
      if (typeof payload.sub !== "string")
        return reject(new createHttpError.Unauthorized());

      resolve(payload.sub);
    });
  });
};
