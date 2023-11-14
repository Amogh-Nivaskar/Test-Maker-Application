import { Types } from "mongoose";
import { Response, Request } from "express";
import OrganizationService from "../services/organization";
import { IOrganization } from "../interfaces/organization";
import Postgres from "../connections/postgresDB";

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

export async function createTable(req: Request, res: Response) {
  try {
    const { createTableQuery, populateTableQuery } = req.body;
    const { organizationId } = req.params;
    // const modifiedCreateTableQuery = addingOrganizationIdentifierToTableName(
    //   createTableQuery,
    //   organizationId
    // );

    // if (modifiedCreateTableQuery) {
    //   const ans = await Postgres.query(modifiedCreateTableQuery);
    //   return res.status(201).json({ message: "Created table successfully" });
    // }

    await OrganizationService.addTable(createTableQuery, populateTableQuery);

    return res.status(201).json({ message: "Created table successfully" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

function addingOrganizationIdentifierToTableName(
  createTableQuery: string,
  organizationId: string
) {
  const splitQuery = createTableQuery
    .toLowerCase()
    .split("create table")[1]
    .split("(");

  const tableName = splitQuery[0] + "_" + organizationId;

  const restOfQuery = splitQuery.slice(1).join("(");

  const modifiedQuery = "create table" + tableName + "(" + restOfQuery;

  console.log(modifiedQuery);
  return modifiedQuery;
}
