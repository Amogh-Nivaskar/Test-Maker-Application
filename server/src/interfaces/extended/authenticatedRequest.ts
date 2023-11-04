import { Request } from "express";
import { IUser } from "../user";
export interface IAuthenticatedRequest extends Request {
  user: IUser;
}
