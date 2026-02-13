import { Request, Response } from "express";
import { getTodos, SortBy, SortOrder } from "./todo.repository";

export async function getTodosHandler(req: Request, res: Response) {
  const { page, pageSize, sortBy, sortOrder } = req.query;

  const result = await getTodos({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 5,
    sortBy: sortBy as SortBy,
    sortOrder: sortOrder as SortOrder,
  });

  res.json(result);
}
