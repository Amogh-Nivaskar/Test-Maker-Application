import { UserRole } from "../utils/enums/roles";
import { IUser } from "./user";

export interface IInvite {
  user: IUser | IUser["_id"];
  role: UserRole;
}
