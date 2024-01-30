import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import { connectToMongoDB } from "./connections/mongodbAtlas";
import UserRoutes from "./routes/user";
import OrganizationRoutes from "./routes/organization";
import ClassroomRoutes from "./routes/classroom";
import TestRoutes from "./routes/test";
import { validateUserAuthentication } from "./middleware/authentication";

const app = express();

const PORT: number = Number(process.env.PORT) || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({ message: "Here is your data", token: "abcd" });
});

app.use("/user", UserRoutes);
app.use("/organization", validateUserAuthentication, OrganizationRoutes);
app.use(
  "/organization/:organizationId/classroom",
  validateUserAuthentication,
  ClassroomRoutes
);
app.use(
  "/organization/:organizationId/classroom/:classroomId/test",
  validateUserAuthentication,
  TestRoutes
);

async function init() {
  await connectToMongoDB();

  app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
}

init();
