import { Types } from "mongoose";
import { IOrganization } from "./organization";
import { ITest } from "./test";
import { IUser } from "./user";
import { IInvite } from "./invite";

export interface IClassroom {
  _id: Types.ObjectId;
  name: string;
  organization: IOrganization | IOrganization["_id"];
  admin: IUser | IUser["_id"];
  teachers: Array<IUser> | Array<IUser["_id"]>;
  students: Array<IUser> | Array<IUser["_id"]>;
  tests: Array<ITest> | Array<ITest["_id"]>;
  invitesSent: Array<IInvite>;
}
