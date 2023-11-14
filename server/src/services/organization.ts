import mongoose, { Types } from "mongoose";
import { OrganizationModel } from "../models/organization";
import { UserRole } from "../utils/enums/roles";
import { IOrganization } from "../interfaces/organization";
import { IUser } from "../interfaces/user";
import { IClassroom } from "../interfaces/classroom";
import { IInvite } from "../interfaces/invite";
import { UserModel } from "../models/user";
import UserService from "./user";
import Postgres from "../connections/postgresDB";

class OrganizationService implements IOrganization {
  _id: Types.ObjectId;
  name: string;
  admin: IUser | IUser["_id"];
  teachers: Array<IUser> | Array<IUser["_id"]>;
  students: Array<IUser> | Array<IUser["_id"]>;
  classrooms: Array<IClassroom> | Array<IClassroom["_id"]>;
  invitesSent: Array<IInvite>;

  public constructor(organization: any) {
    this._id = organization._id;
    this.name = organization.name;
    this.admin = organization.admin;
    this.teachers = organization.teachers;
    this.students = organization.students;
    this.classrooms = organization.classrooms;
    this.invitesSent = organization.invitesSent;
  }

  public static async createOrganization(
    name: string,
    userId: Types.ObjectId
  ): Promise<void> {
    if (!name || !userId) throw new Error("Name and UserId required");
    const organization = new OrganizationModel({
      name,
      admin: userId,
      teachers: [userId],
    });
    await organization.save();
    const user = await UserService.getUserById(userId);
    if (!user) throw new Error("User not found");
    // PATCHUP
    const organizationId = organization._id as Types.ObjectId & IOrganization;
    user.ownedOrganizations.push(organizationId);
    user.organizations.push({ id: organizationId, classrooms: [] });
    await user.save();
  }

  public static async getOrganizationById(organizationId: Types.ObjectId) {
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) throw new Error("Organization not found");
    return organization;
  }

  public async isOrganizationAdmin(userId: Types.ObjectId): Promise<boolean> {
    const organization = await OrganizationModel.findById(this._id);
    if (!organization)
      throw new Error(`Organization by ${this._id} ID does not exist`);

    if (organization.admin === userId || organization.admin?.id === userId)
      return true;

    return false;
  }

  public async getOrganizationRole(userId: Types.ObjectId): Promise<UserRole> {
    const organization = await OrganizationModel.findById(this._id);
    if (!organization)
      throw new Error(`Organization by ${this._id} ID does not exist`);

    if (organization.admin.toString() === userId.toString())
      return UserRole.Admin;
    else if (organization.teachers.includes(userId)) return UserRole.Teacher;
    else if (organization.students.includes(userId)) return UserRole.Student;

    return UserRole.NonMember;
  }

  public async addTeacher(userId: Types.ObjectId): Promise<void> {
    const organization = await OrganizationModel.findById(this._id);
    if (!organization) throw new Error("Organization doesnt exist");
    const userRole = await this.getOrganizationRole(userId);
    if (userRole === UserRole.NonMember) {
      organization?.teachers.push(userId);
      await organization?.save();
      this.teachers = organization.teachers;
    }

    throw new Error(
      `User is already a member of this Organization as a ${userRole}`
    );
  }

  public async addTeachers(userIdsList: Types.ObjectId[]): Promise<void> {
    const promises = userIdsList.map((userId) => {
      return this.addTeacher(userId);
    });

    await Promise.all(promises);
  }

  public async addStudent(userId: Types.ObjectId): Promise<void> {
    const organization = await OrganizationModel.findById(this._id);
    if (!organization) throw new Error("Organization doesnt exist");
    const userRole = await this.getOrganizationRole(userId);
    if (userRole === UserRole.NonMember) {
      organization?.students.push(userId);
      await organization?.save();
      this.students = organization.students;
    }

    throw new Error(
      `User is already a member of this Organization as a ${userRole}`
    );
  }

  public async addStudents(userIdsList: Types.ObjectId[]): Promise<void> {
    const promises = userIdsList.map((userId) => {
      return this.addStudent(userId);
    });

    await Promise.all(promises);
  }

  public async sendInvite(
    userId: Types.ObjectId,
    role: UserRole
  ): Promise<void> {
    if (role === UserRole.Admin || role === UserRole.NonMember)
      throw new Error(`Cant send invite for ${role} role`);

    const userOrganizationRole = await this.getOrganizationRole(userId);

    if (userOrganizationRole !== UserRole.NonMember)
      throw new Error("User is already part of this organization");

    const organization = await OrganizationModel.findById(this._id);
    if (!organization) throw new Error("Organization doesnt exist");

    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User doesnt exist");

    organization.invitesSent.map((invite: any) => {
      if (invite.user.toString() === userId.toString()) {
        throw new Error(
          "User has already been sent an invite from this organization"
        );
      }
    });

    organization.invitesSent.push({ user: userId, role });
    await organization.save();
    this.invitesSent = organization.invitesSent;

    user.organizationInvites.push({ from: this._id, role });
    await user.save();
  }

  public static async addTable(
    createTableQuery: string,
    populateTableQuery: string
  ) {
    await Postgres.query(createTableQuery);
    await Postgres.query(populateTableQuery);
  }

  // TODO -  delete org

  // public async deleteClassroom(classroomId: string): Promise<void> {
  //   const classroom = await ClassroomModel.findById(new ObjectId(classroomId));

  //   const promises = classroom?.tests.map((testId) => {
  //     return await TestModel.findByIdAndDelete;
  //   });
  // }
}

export default OrganizationService;
