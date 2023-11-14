import { NextFunction, Request, Response } from "express";
import OrganizationService from "../../services/organization";
import { IOrganization } from "../../interfaces/organization";
import { Types } from "mongoose";
import { UserRole } from "../../utils/enums/roles";

export async function validateSendingOrganizationInviteAuthorization(
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
      return res.status(401).json({
        message:
          "Access Denied. User needs to be organization's admin to send organization invite",
      });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}
