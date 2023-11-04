import mongoose, { Types } from "mongoose";
import { ClassroomModel } from "../models/classroom";
import { UserRole } from "../utils/roles";
import OrganizationService from "./organization";
import { IClassroom } from "../interfaces/classroom";
import { IOrganization } from "../interfaces/organization";
import { IUser } from "../interfaces/user";
import { ITest } from "../interfaces/test";
import { IInvite } from "../interfaces/invite";
import { UserModel } from "../models/user";
import { OrganizationModel } from "../models/organization";
import UserService from "./user";

class ClassroomService implements IClassroom {
  _id: Types.ObjectId;
  name: string;
  organization: IOrganization | IOrganization["_id"];
  admin: IUser | IUser["_id"];
  teachers: Array<IUser> | Array<IUser["_id"]>;
  students: Array<IUser> | Array<IUser["_id"]>;
  tests: Array<ITest> | Array<ITest["_id"]>;
  invitesSent: Array<IInvite>;

  public constructor(classroom: IClassroom) {
    this._id = classroom._id;
    this.name = classroom.name;
    this.organization = classroom.organization;
    this.admin = classroom.admin;
    this.teachers = classroom.teachers;
    this.students = classroom.students;
    this.tests = classroom.tests;
    this.invitesSent = classroom.invitesSent;
  }

  public async getClassroomRole(userId: Types.ObjectId): Promise<UserRole> {
    const classroom = await ClassroomModel.findById(this._id);
    if (!classroom)
      throw new Error(`Classroom by ${this._id} ID does not exist`);

    if (classroom.admin === userId) return UserRole.Admin;
    else if (classroom.teachers.includes(userId)) return UserRole.Teacher;
    else if (classroom.students.includes(userId)) return UserRole.Student;

    return UserRole.NonMember;
  }

  public static async getClassroomById(classroomId: Types.ObjectId) {
    const classroom = ClassroomModel.findById(classroomId);
    if (!classroom) throw new Error("Classroom not found");
    return classroom;
  }

  public static async createClassroom(
    name: string,
    classroomAdminId: Types.ObjectId,
    organizationId: Types.ObjectId
  ): Promise<void> {
    const organization = await OrganizationService.getOrganizationById(
      organizationId
    );

    if (!organization) throw new Error("Organization Not Found");

    const classroomAdmin = await UserService.getUserById(classroomAdminId);
    if (!classroomAdmin)
      throw new Error(`User with id ${classroomAdminId} doesn't exist`);

    const organizationService = new OrganizationService(
      organization as unknown as IOrganization
    );

    const userOrganizationRole = await organizationService.getOrganizationRole(
      classroomAdminId
    );

    if (
      userOrganizationRole !== UserRole.Teacher &&
      userOrganizationRole !== UserRole.Admin
    ) {
      throw new Error(
        "Classroom's admin can only be a teacher or admin of its respective organization"
      );
    }

    if (!name || !classroomAdminId)
      throw new Error("Name and ClassroomAdminId required");
    const classroom = new ClassroomModel({
      name,
      admin: classroomAdminId,
      teachers: [classroomAdminId],
      organization: organizationId,
    });

    organization.classrooms.push(classroom._id);

    classroomAdmin.organizations = classroomAdmin.organizations.map(
      (org: any) => {
        const { id, classrooms } = org;
        if (id.toString() === organizationId.toString()) {
          return { id, classrooms: [...classrooms, classroom._id] };
        }
        return { id, classrooms };
      }
    );

    await classroomAdmin.save();
    await organization.save();
    await classroom.save();
  }

  public async addTeacher(userId: Types.ObjectId): Promise<void> {
    const classroom = await ClassroomModel.findById(this._id).populate(
      "organization"
    );

    const userClassroomRole = await this.getClassroomRole(userId);

    const organization = new OrganizationService(classroom?.organization);
    const userOrganizationRole = await organization.getOrganizationRole(userId);

    // User should be member of organization and not be an existing member of classroom
    if (
      userOrganizationRole !== UserRole.NonMember &&
      userClassroomRole === UserRole.NonMember
    ) {
      classroom?.teachers.push(userId);
      await classroom?.save();
    } else if (userOrganizationRole === UserRole.NonMember) {
      throw new Error("User is not part of organization");
    } else {
      throw new Error(
        `User is already a member of this Classroom as a ${userClassroomRole}`
      );
    }
  }

  public async addTeachers(userIdsList: Types.ObjectId[]): Promise<void> {
    const promises = userIdsList.map((userId) => {
      return this.addTeacher(userId);
    });

    await Promise.all(promises);
  }

  public async addStudent(userId: Types.ObjectId): Promise<void> {
    const classroom = await ClassroomModel.findById(this._id);
    const userRole = await this.getClassroomRole(userId);
    if (userRole === UserRole.NonMember) {
      classroom?.students.push(userId);
      await classroom?.save();
    }

    throw new Error(
      `User is already a member of this Classroom as a ${userRole}`
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
      throw new Error(`Can't send invite for ${role} role`);

    const classroom = await ClassroomModel.findById(this._id).populate(
      "organization"
    );

    if (!classroom) throw new Error("Classroom doesn't exist");

    const organization = new OrganizationService(classroom.organization);

    const userOrganizationRole = await organization.getOrganizationRole(userId);

    if (userOrganizationRole === UserRole.NonMember)
      throw new Error(
        "Can't send invite since user isn't part of the classrooms's organization"
      );

    const userClassroomRole = await this.getClassroomRole(userId);

    if (userClassroomRole !== UserRole.NonMember)
      throw new Error("User is already part of this classroom");

    classroom.invitesSent.map((invite: any) => {
      if (invite.user.toString() === userId.toString()) {
        throw new Error(
          "User has already been sent an invite from this classroom"
        );
      }
    });

    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    if (
      (role === UserRole.Teacher &&
        userOrganizationRole === UserRole.Teacher) ||
      (role === UserRole.Student && userOrganizationRole === UserRole.Student)
    ) {
      classroom.invitesSent.push({ user: userId, role });
      await classroom.save();
      this.invitesSent = classroom.invitesSent;

      user.classroomInvites.push({ from: this._id, role });
      await user.save();
    } else {
      throw new Error(
        "Invited classroom's role and user's organization role don't match"
      );
    }
  }

  // TODO: Delete Classroom
}

export default ClassroomService;
