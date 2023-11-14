import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToMongoDB } from "./connections/mongodbAtlas";

import UserRoutes from "./routes/user";
import OrganizationRoutes from "./routes/organization";
import ClassroomRoutes from "./routes/classroom";
// import { connectToPostgresDB } from "./connections/postgresDB";

dotenv.config();
const app = express();

const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ message: "Here is your data" });
});

app.use("/user", UserRoutes);
app.use("/organization", OrganizationRoutes);
app.use("/organization/:organizationId/classroom", ClassroomRoutes);

async function init() {
  await connectToMongoDB();

  // await connectToPostgresDB();

  app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
}

init();
