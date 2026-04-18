import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import { configuration } from "./config";
import { NoteRepository } from "./repositories/noteRepository";
import { UserRepository } from "./repositories/userRepository";
import { db } from "./database";
import { toNoteDto, toUserDto } from "./dtos";

const app = express();
app.use(cors());
app.use(express.json());

const openApiPath = path.resolve(process.cwd(), "openapi/openapi.yml");
const openApiContent = fs.readFileSync(openApiPath, "utf8");
const openApiDocument = yaml.load(openApiContent) as object;
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

const noteRepository = new NoteRepository(db);
const userRepository = new UserRepository(db);

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await userRepository.findAll();
    const dto = users.map((u) => toUserDto(u));
    res.status(200).json(dto);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      type: "InternalServerError",
      message: "Failed to fetch users",
    });
  }
});

app.get("/notes", async (req: Request, res: Response) => {
  try {
    const notes = await noteRepository.findAll();
    const users = await userRepository.findAll();
    const usernameById = new Map(users.map((u) => [u.id, u.username]));
    const noteDtos = notes.map((note) =>
      toNoteDto(
        note,
        usernameById.get(note.userId) ?? note.userId,
        usernameById.get(note.handoverUserId) ?? note.handoverUserId,
      ),
    );

    res.status(200).json(noteDtos);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({
      type: "InternalServerError",
      message: "Failed to fetch notes",
    });
  }
});

app.post("/notes", async (req: Request, res: Response) => {
  try {
    const { author, finishedTask, wipTask, blockerTask, handover } = req.body;

    if (!author || !handover) {
      return res.status(400).json({
        type: "ValidationError",
        message: "Missing required fields: author, handover",
      });
    }

    const [authorUser, handoverUser] = await Promise.all([
      userRepository.findByUsername(author),
      userRepository.findByUsername(handover),
    ]);

    if (!authorUser || !handoverUser) {
      return res.status(400).json({
        type: "ValidationError",
        message: "author and handover must be existing usernames",
      });
    }

    await noteRepository.create({
      user_id: authorUser.id,
      finished_task: finishedTask,
      wip_task: wipTask,
      blocker_task: blockerTask,
      handover_user_id: handoverUser.id,
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({
      type: "InternalServerError",
      message: "Failed to create note",
    });
  }
});

async function startServer() {
  try {
    app.listen(configuration.containerPort, () => {
      console.log(`Backend running on ${configuration.baseUrl}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
