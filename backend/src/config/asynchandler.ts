import { Request, Response, NextFunction } from "express";

 const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next); // Pass errors to Express error handler
  };
};
export default asyncHandler;

