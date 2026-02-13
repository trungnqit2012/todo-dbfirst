import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type SortBy = "createdAt" | "title" | "status";
export type SortOrder = "asc" | "desc";
export type Filter = "all" | "active" | "completed";

export interface GetTodosPagedParams {
  page: number;
  pageSize: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filter: Filter;
  q?: string;
}

export async function getTodosPaged({
  page,
  pageSize,
  sortBy,
  sortOrder,
  filter,
  q,
}: GetTodosPagedParams) {
  /* ---------- defensive ---------- */
  const safePage = Math.max(page || 1, 1);
  const safePageSize = Math.max(pageSize || 5, 1);
  const skip = (safePage - 1) * safePageSize;

  /* ==============================
     WHERE (FILTER + SEARCH)
  ============================== */
  const where: Prisma.TodoWhereInput = {};

  if (filter === "active") where.completed = false;
  if (filter === "completed") where.completed = true;

  if (q) {
    where.title = {
      contains: q,
      mode: "insensitive",
    };
  }

  /* ==============================
     ORDER BY (STABLE)
  ============================== */
  let orderBy: Prisma.TodoOrderByWithRelationInput[];

  if (sortBy === "status") {
    orderBy = [{ completed: sortOrder }, { createdAt: "desc" }];
  } else {
    orderBy = [{ [sortBy]: sortOrder }];
  }

  /* ==============================
     QUERY (TRANSACTION)
  ============================== */
  const [items, totalItems, totalActive, totalCompleted] =
    await prisma.$transaction([
      prisma.todo.findMany({
        where,
        orderBy,
        skip,
        take: safePageSize,
      }),
      prisma.todo.count({ where }),
      prisma.todo.count({ where: { completed: false } }),
      prisma.todo.count({ where: { completed: true } }),
    ]);

  return {
    items, // ALWAYS array
    page: safePage,
    pageSize: safePageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / safePageSize)),
    totalActive,
    totalCompleted,
    sortBy,
    sortOrder,
  };
}

/* ==============================
   WRITE
============================== */

export function createTodo(title: string) {
  return prisma.todo.create({
    data: { title },
  });
}

export function toggleTodo(id: string, completed: boolean) {
  return prisma.todo.update({
    where: { id },
    data: { completed },
  });
}

export function deleteTodo(id: string) {
  return prisma.todo.delete({
    where: { id },
  });
}
