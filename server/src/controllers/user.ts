import { Types } from "mongoose";
import UserService from "../services/user";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces/user";

export async function signupWithEmailAndPassword(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const accessToken = await UserService.signupWithEmailAndPassword(
      name,
      email,
      password
    );
    return res
      .status(201)
      .json({ message: "User Signed Up Successfully", accessToken, email });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong in Sign Up" });
  }
}

export async function signinWithEmailAndPassword(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const accessToken = await UserService.signinWithEmailAndPassword(
      email,
      password
    );
    return res
      .status(201)
      .json({ message: "User Signed In Successfully", accessToken, email });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong in Sign In" });
  }
}

export async function acceptOrganizationInvite(req: Request, res: Response) {
  try {
    const { _id } = req.user;
    const { organizationId } = req.body;
    // PATCHUP
    const user: IUser | null = (await UserService.getUserById(
      _id
    )) as unknown as IUser;
    if (!user) throw new Error("User not found");
    const userService = new UserService(user);

    await userService.acceptOrganizationInvite(organizationId);

    return res
      .status(201)
      .json({ message: "Successfully accepted Organization Invite" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

export async function acceptClassroomInvite(req: Request, res: Response) {
  try {
    const { _id } = req.user;
    const { classroomId } = req.body;

    const user = (await UserService.getUserById(_id)) as unknown as IUser;
    if (!user) throw new Error("User not found");

    const userService = new UserService(user);
    await userService.acceptClassroomInvite(classroomId);

    return res
      .status(201)
      .json({ message: "Sunccessfully accepted Classroom Invite" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}
