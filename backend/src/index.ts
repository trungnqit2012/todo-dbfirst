import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Todo API is running");
});

app.get("/api/todos", async (_req, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const todo = await prisma.todo.create({
    data: { title },
  });

  res.status(201).json(todo);
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.todo.delete({ where: { id } });
  res.status(204).send();
});

app.patch("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "completed must be boolean" });
  }

  const todo = await prisma.todo.update({
    where: { id },
    data: { completed },
  });

  res.json(todo);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
