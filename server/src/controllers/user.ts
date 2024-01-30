import UserService from "../services/user";
import { Request, Response } from "express";
import { IUser } from "../interfaces/user";

export const ACCESS_TOKEN = "__Access_Token__";

export async function userExists(req: Request, res: Response) {
  try {
    const email = req.query.email as string;
    const existingUser = await UserService.getUserByEmail(email);
    return res
      .status(200)
      .json({ message: "Checked User Successfully", existingUser });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Something went wrong in checking if user already exists",
    });
  }
}

// export async function signupWithEmailAndPassword(req: Request, res: Response) {
//   try {
//     const { name, email, password } = req.body;
//     const payload = await UserService.signupWithEmailAndPassword(
//       name,
//       email,
//       password
//     );
//     return res
//       .status(201)
//       .json({ message: "User Signed Up Successfully", payload });
//   } catch (error: any) {
//     console.log("Error in sign up: ", error.message);
//     return res.status(400).json({ message: error.message });
//   }
// }

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, provider } = req.body;
    const payload = await UserService.signUp(email, email, provider, password);

    return res.status(201).json({
      message: "User Signed Up Successfull",
      user: payload?.user,
      accessToken: payload?.accessToken,
    });
  } catch (error: any) {
    console.log("Error in sign up: ", error.message);
    return res.status(400).json({ message: error.message });
  }
}

export async function signin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const payload = await UserService.signinWithEmailAndPassword(
      email,
      password
    );
    res.cookie(ACCESS_TOKEN, payload?.accessToken);
    return res.status(200).json({
      message: "User Signed In Successfully",
      user: payload?.user,
      accessToken: payload?.accessToken,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong in Sign In" });
  }
}

export async function checkAuthStatus(req: Request, res: Response) {
  try {
    const user = req.user;
    if (user) {
      return res
        .status(200)
        .json({ message: "User is currently logged in", user });
    } else {
      return res.status(401).json({ message: "User is not logged in" });
    }
  } catch (error: any) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Something went wrong when checking auth status" });
  }
}

export async function getOrganizations(req: Request, res: Response) {
  try {
    const { _id } = req.user;

    // PATCHUP
    const user: IUser | null = (await UserService.getUserById(
      _id
    )) as unknown as IUser;
    if (!user) throw new Error("User not found");
    const userService = new UserService(user);

    const organizations = await userService.getOrganizations();

    return res
      .status(201)
      .json({ message: "Successfully fetched organizations", organizations });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
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
