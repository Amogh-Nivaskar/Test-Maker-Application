import { Request, Response } from "express";
import { Types } from "mongoose";
import ClassroomService from "../services/classroom";
import { IClassroom } from "../interfaces/classroom";

export async function createClassroom(req: Request, res: Response) {
  try {
    const user = req.user;
    const { name, classroomAdminId } = req.body;
    const { organizationId } = req.params;

    await ClassroomService.createClassroom(
      name,
      classroomAdminId,
      organizationId as unknown as Types.ObjectId
    );
    return res.status(201).json({ message: "Classroom Created Successfully" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

export async function sendClassroomInvite(req: Request, res: Response) {
  try {
    const user = req.user;
    const { invitedUserId, role } = req.body;
    const { classroomId, organizationId } = req.params;
    const classroom = (await ClassroomService.getClassroomById(
      classroomId as unknown as Types.ObjectId
    )) as unknown as IClassroom;
    const classroomService = new ClassroomService(classroom);
    await classroomService.sendInvite(invitedUserId, role);
    return res
      .status(201)
      .json({ message: "Classroom Invite Sent Successfully" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}
