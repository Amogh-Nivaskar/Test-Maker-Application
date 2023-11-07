import { NextFunction, Request, Response } from "express";
import OrganizationService from "../../services/organization";
import { Types } from "mongoose";
import { IOrganization } from "../../interfaces/organization";
import { UserRole } from "../../utils/enums/roles";
import ClassroomService from "../../services/classroom";
import { IClassroom } from "../../interfaces/classroom";

export async function validateCreatingClassroomAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const { organizationId } = req.params;
    const organization = await OrganizationService.getOrganizationById(
      organizationId as unknown as Types.ObjectId
    );
    const organizationService = new OrganizationService(
      organization as unknown as IOrganization
    );

    const userOrganizationRole = await organizationService.getOrganizationRole(
      user._id
    );

    if (userOrganizationRole === UserRole.Admin) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "Access Denied. User is not Organization admin" });
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export async function validateSendingClassroomInviteAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const { organizationId, classroomId } = req.params;
    const organization = await OrganizationService.getOrganizationById(
      organizationId as unknown as Types.ObjectId
    );
    const organizationService = new OrganizationService(
      organization as unknown as IOrganization
    );

    const userOrganizationRole = await organizationService.getOrganizationRole(
      user._id
    );

    const classroom = await ClassroomService.getClassroomById(
      classroomId as unknown as Types.ObjectId
    );

    const classroomService = new ClassroomService(
      classroom as unknown as IClassroom
    );

    const userClassroomRole = await classroomService.getClassroomRole(user._id);

    if (
      userClassroomRole === UserRole.Admin ||
      userOrganizationRole === UserRole.Admin
    ) {
      next();
    } else {
      return res.status(401).json({
        message:
          "Access Denied. User needs to be either classroom's admin or classroom's organization's admin to send classroom invite",
      });
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}
