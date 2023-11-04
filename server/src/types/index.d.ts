import { IUser } from "../interfaces/user";
import { UserJWTPayload } from "../services/user";

export {};

declare global {
  namespace Express {
    interface Request {
      user: UserJWTPayload;
    }
  }
}
