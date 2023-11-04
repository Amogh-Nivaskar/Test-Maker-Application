import { Request, Response, NextFunction } from "express";
import UserService from "../services/user";

export async function validateUserAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header("Authorization");
    if (!token) throw new Error("No Token found in request header");
    const user = UserService.verifyToken(token);
    if (!user) throw new Error("Token is faulty");
    req.user = user;
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(401).json({ message: error.message });
  }
}
