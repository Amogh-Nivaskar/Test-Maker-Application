import jwt from "jsonwebtoken";
import { UserModel } from "../models/user";
import { IRecievedInvite, IUser } from "../interfaces/user";
import { Types } from "mongoose";
import { IOrganization } from "../interfaces/organization";
import { OrganizationModel } from "../models/organization";
import { UserRole } from "../utils/enums/roles";
import { IInvite } from "../interfaces/invite";
import { ClassroomModel } from "../models/classroom";
import { ObjectId } from "mongodb";
import { IClassroom } from "../interfaces/classroom";

export interface UserJWTPayload {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

class UserService implements IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  ownedOrganizations: Array<IOrganization> | Array<IOrganization["_id"]>;
  organizations: Array<IOrganization> | Array<IOrganization["_id"]>;
  organizationInvites: Array<IRecievedInvite>;
  classroomInvites: Array<IRecievedInvite>;

  public constructor(user: IUser) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.ownedOrganizations = user.ownedOrganizations;
    this.organizations = user.organizations;
    this.organizationInvites = user.organizationInvites;
    this.classroomInvites = user.classroomInvites;
  }

  public static async getUserByEmail(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return user;
  }
  public static async getUserById(id: Types.ObjectId) {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return user;
  }

  public static async signupWithEmailAndPassword(
    name: string,
    email: string,
    password: string
  ): Promise<string> {
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) throw new Error(`User by this email already exists`);

    const user = new UserModel({ name, email, password });

    await user.save();

    const accessToken = this.generateAccessToken(email);

    return accessToken;
  }

  public static async signinWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<string> {
    const existingUser = await this.getUserByEmail(email);
    if (!existingUser) throw new Error("No user with given email ID");

    if (existingUser.password !== password) {
      throw new Error("Incorrect email or password");
    }

    const accessToken = this.generateAccessToken(email);

    return accessToken;
  }

  private static async generateAccessToken(email: string): Promise<string> {
    const user = await this.getUserByEmail(email);

    if (!user) throw new Error("No user with given email ID");

    const accessToken = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      String(process.env.JWT_SECRET),
      {
        expiresIn: "1d",
      }
    );

    return accessToken;
  }

  public static verifyToken(token: string): UserJWTPayload | null {
    try {
      const user: UserJWTPayload = jwt.verify(
        token,
        String(process.env.JWT_SECRET)
      ) as UserJWTPayload;

      return user;
    } catch (error) {
      return null;
    }
  }

  public async acceptOrganizationInvite(
    organizationId: Types.ObjectId
  ): Promise<void> {
    const user = await UserModel.findById(this._id);
    if (!user) throw new Error("User doesnt exist");

    const targetInvite = this.organizationInvites.find(
      (invite) => invite.from.toString() === organizationId.toString()
    );

    if (!targetInvite)
      throw new Error("User doesnt have an invite from this organization");

    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) throw new Error("Organization doesnt exist");

    if (targetInvite.role === UserRole.Teacher) {
      organization.teachers.push(this._id);
    } else if (targetInvite.role === UserRole.Student) {
      organization.students.push(this._id);
    }
    // CHECK
    organization.invitesSent = organization.invitesSent.filter(
      (invite: IInvite) => invite.user.toString() != this._id.toString()
    );

    await organization.save();

    user.organizations.push(organization._id);
    this.organizations = user.organizations;

    user.organizationInvites = user.organizationInvites.filter(
      (invite: IRecievedInvite) =>
        invite.from.toString() !== organizationId.toString()
    );
    user.organizations = [
      ...user.organizations,
      { id: organization._id, classrooms: [] },
    ];
    this.organizations = user.organizations;
    this.organizationInvites = user.organizationInvites;
    await user.save();
  }

  public async acceptClassroomInvite(
    classroomId: Types.ObjectId
  ): Promise<void> {
    const user = await UserModel.findById(this._id);
    if (!user) throw new Error("User doesnt exist");

    const targetInvite = this.classroomInvites.find(
      (invite) => invite.from.toString() === classroomId.toString()
    );
    if (!targetInvite)
      throw new Error("User doesnt have an invite from this organization");

    const classroom = await ClassroomModel.findById(classroomId);
    if (!classroom) throw new Error("Classroom doesn't exist");

    if (targetInvite.role === UserRole.Teacher) {
      classroom.teachers.push(this._id);
    } else if (targetInvite.role === UserRole.Student) {
      classroom.students.push(this._id);
    }
    // CHECK
    classroom.invitesSent = classroom.invitesSent.filter(
      (invite: IInvite) => invite.user.toString() !== this._id.toString()
    );

    await classroom.save();

    user.classroomInvites = user.classroomInvites.filter(
      (invite: IRecievedInvite) =>
        invite.from.toString() !== classroomId.toString()
    );
    this.classroomInvites = user.classroomInvites;
    await user.save();
  }
}

export default UserService;
