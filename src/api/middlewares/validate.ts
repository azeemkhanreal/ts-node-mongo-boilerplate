import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next()
  } catch (error: any) {
    const errorMessage = error.errors.map((details: any) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage))
  }
}

export default validate;
