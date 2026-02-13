import { Request, Response } from "express";

import {
  getTodosPaged,
  createTodo,
  toggleTodo,
  deleteTodo,
  SortBy,
  SortOrder,
  Filter,
} from "./todo.repository";

/* ==============================
   Helpers
============================== */

function assertStringId(id: unknown, res: Response): id is string {
  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid id" });
    return false;
  }
  return true;
}

/* ==============================
   GET /api/todos
============================== */

export async function getTodosHandler(req: Request, res: Response) {
  try {
    const {
      page = "1",
      pageSize = "5",
      sortBy = "createdAt",
      sortOrder = "desc",
      filter = "all",
      q,
    } = req.query;

    /* ---------- validate + normalize ---------- */

    const pageNum = Math.max(Number(page) || 1, 1);
    const pageSizeNum = Math.max(Number(pageSize) || 5, 1);

    const allowedSortBy: SortBy[] = ["createdAt", "title", "status"];
    const allowedSortOrder: SortOrder[] = ["asc", "desc"];
    const allowedFilter: Filter[] = ["all", "active", "completed"];

    const safeSortBy: SortBy = allowedSortBy.includes(sortBy as SortBy)
      ? (sortBy as SortBy)
      : "createdAt";

    const safeSortOrder: SortOrder = allowedSortOrder.includes(
      sortOrder as SortOrder,
    )
      ? (sortOrder as SortOrder)
      : "desc";

    const safeFilter: Filter = allowedFilter.includes(filter as Filter)
      ? (filter as Filter)
      : "all";

    /* ---------- query ---------- */

    const result = await getTodosPaged({
      page: pageNum,
      pageSize: pageSizeNum,
      sortBy: safeSortBy,
      sortOrder: safeSortOrder,
      filter: safeFilter,
      ...(typeof q === "string" && q.trim() ? { q } : {}),
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load todos" });
  }
}

/* ==============================
   POST /api/todos
============================== */

export async function createTodoHandler(req: Request, res: Response) {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "Title is required" });
  }

  const todo = await createTodo(title);
  res.status(201).json(todo);
}

/* ==============================
   PATCH /api/todos/:id
============================== */

export async function toggleTodoHandler(req: Request, res: Response) {
  const { id } = req.params;
  const { completed } = req.body;

  if (!assertStringId(id, res)) return;

  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "completed must be boolean" });
  }

  const todo = await toggleTodo(id, completed);
  res.json(todo);
}

/* ==============================
   DELETE /api/todos/:id
============================== */

export async function deleteTodoHandler(req: Request, res: Response) {
  const { id } = req.params;

  if (!assertStringId(id, res)) return;

  await deleteTodo(id);
  res.status(204).send();
}
