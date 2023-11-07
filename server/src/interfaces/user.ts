import { Types } from "mongoose";
import { IClassroom } from "./classroom";
import { IOrganization } from "./organization";
import { UserRole } from "../utils/enums/roles";

export interface IRecievedInvite {
  from: IOrganization | IOrganization["_id"] | IClassroom | IClassroom["_id"];
  role: UserRole;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  ownedOrganizations: Array<IOrganization> | Array<IOrganization["_id"]>;
  organizations: Array<IOrganization> | Array<IOrganization["_id"]>;
  organizationInvites: Array<IRecievedInvite>;
  classroomInvites: Array<IRecievedInvite>;
}
