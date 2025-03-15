import { Response } from "express";

export const successResponse = (
  res: Response,
  message: string,
  data: any = {},
  statusCode: number = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Error Response
export const errorResponse = (
  res: Response,
  message: string,
  errors: any = {},
  statusCode: number = 500,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};