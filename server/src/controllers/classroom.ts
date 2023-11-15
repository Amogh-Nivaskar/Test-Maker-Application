import { Request, Response } from "express";
import { Types } from "mongoose";
import ClassroomService from "../services/classroom";
import { IClassroom } from "../interfaces/classroom";
import TestService from "../services/test";

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

export async function createTest(req: Request, res: Response) {
  try {
    const user = req.user;
    const { classroomId, organizationId } = req.params;
    const { test } = req.body;

    const outputs = await TestService.checkTest(test);

    const testService = new TestService(test);
    testService.createTest(outputs);

    return res
      .status(201)
      .json({ message: "Created Test Successfully", outputs });
  } catch (error: any) {
    console.log(error);
    return res
      .status(400)
      .json({ message: error.message, errorQuestionIdx: error.questionIdx });
  }
}
