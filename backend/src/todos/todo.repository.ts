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
  const skip = (page - 1) * pageSize;

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
     ORDER BY (GLOBAL → STABLE)
  ============================== */
  let orderBy: Prisma.TodoOrderByWithRelationInput[];

  if (sortBy === "status") {
    orderBy = [
      { completed: sortOrder },
      { createdAt: "desc" }, // secondary stable sort
    ];
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
        take: pageSize,
      }),
      prisma.todo.count({ where }),
      prisma.todo.count({ where: { completed: false } }),
      prisma.todo.count({ where: { completed: true } }),
    ]);

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
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
