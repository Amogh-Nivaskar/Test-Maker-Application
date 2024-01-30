import { Request, Response, NextFunction } from "express";
import UserService from "../services/user";
import { IUser } from "../interfaces/user";
import { Types } from "mongoose";

export async function validateUserAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header("Authorization");

    if (!token) throw new Error("No Token found in request header");
    // const user = UserService.verifyToken(token);
    const userObj = await UserService.getUserByEmail(token);
    if (!userObj) throw new Error("Token is faulty");
    req.user = {
      _id: userObj._id as Types.ObjectId,
      name: userObj.name,
      email: userObj.email,
    };
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(401).json({ message: error.message });
  }
}
