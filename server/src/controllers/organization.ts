import { Types } from "mongoose";
import { Response, Request } from "express";
import OrganizationService from "../services/organization";
import { IOrganization } from "../interfaces/organization";

export async function createOrganization(req: Request, res: Response) {
  try {
    const user = req.user;
    const { name } = req.body;

    await OrganizationService.createOrganization(name, user._id);
    return res
      .status(201)
      .json({ message: "Organization Created Successfully" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

export async function sendOrganizationInvite(req: Request, res: Response) {
  try {
    const user = req.user;
    const { invitedUserId, role } = req.body;
    const { organizationId } = req.params;
    const organization = (await OrganizationService.getOrganizationById(
      organizationId as unknown as Types.ObjectId
    )) as unknown as IOrganization;

    const organizationService = new OrganizationService(organization);

    await organizationService.sendInvite(invitedUserId, role);
    return res
      .status(201)
      .json({ message: "Organization Invite sent successfully" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}
