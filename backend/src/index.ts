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

app.get("/api/todos", async (req, res) => {
  try {
    const {
      page = "1",
      pageSize = "5",
      sortBy = "createdAt",
      sortOrder = "desc",
      filter = "all",
      q = "",
    } = req.query;

    const pageNum = Math.max(1, Number(page));
    const sizeNum = Math.max(1, Number(pageSize));
    const skip = (pageNum - 1) * sizeNum;

    /* ---------- SORT ---------- */
    let orderBy: any;
    switch (sortBy) {
      case "title":
        orderBy = { title: sortOrder === "asc" ? "asc" : "desc" };
        break;
      case "status":
        orderBy = { completed: sortOrder === "asc" ? "asc" : "desc" };
        break;
      default:
        orderBy = { createdAt: sortOrder === "asc" ? "asc" : "desc" };
    }

    /* ---------- WHERE (FILTER + SEARCH) ---------- */
    let where: any = {};

    if (typeof q === "string" && q.trim()) {
      where.title = {
        contains: q.trim(),
        mode: "insensitive",
      };
    }

    if (filter === "active") {
      where.completed = false;
    } else if (filter === "completed") {
      where.completed = true;
    }

    const [items, totalItems] = await Promise.all([
      prisma.todo.findMany({
        where,
        orderBy,
        skip,
        take: sizeNum,
      }),
      prisma.todo.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / sizeNum));

    res.json({
      items,
      page: pageNum,
      pageSize: sizeNum,
      totalItems,
      totalPages,
      sortBy,
      sortOrder,
      filter,
      q,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load todos" });
  }
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

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.todo.delete({ where: { id } });
  res.status(204).send();
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
