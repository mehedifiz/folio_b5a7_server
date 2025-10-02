import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Try to get token from cookie or Authorization header
  const token = req.cookies?.auth || req.headers.authorization

  console.log("req.headers.authorization" , req.headers.authorization)


  console.log("Token from cookie or header:", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  (req as any).token = token;

  next();
};
