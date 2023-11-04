import { Types } from "mongoose";
import { IClassroom } from "./classroom";
import { IUser } from "./user";
import { IInvite } from "./invite";

export interface IOrganization {
  _id: Types.ObjectId;
  name: string;
  admin: IUser | IUser["_id"];
  teachers: Array<IUser> | Array<IUser["_id"]>;
  students: Array<IUser> | Array<IUser["_id"]>;
  classrooms: Array<IClassroom> | Array<IClassroom["_id"]>;
  invitesSent: Array<IInvite>;
}
