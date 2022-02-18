import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

interface ErrorHandler extends ErrorRequestHandler {
  status: number;
  message: string;
}

const errorHandler = (
  error: ErrorHandler,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  res.status(status).json({ error: { status, message } });
};

export default errorHandler;
