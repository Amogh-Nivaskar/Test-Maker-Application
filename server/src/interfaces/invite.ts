import { UserRole } from "../utils/roles";
import { IUser } from "./user";

export interface IInvite {
  user: IUser | IUser["_id"];
  role: UserRole;
}
