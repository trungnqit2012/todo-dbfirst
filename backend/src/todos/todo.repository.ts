import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type SortBy = "createdAt" | "title" | "status";
export type SortOrder = "asc" | "desc";

interface GetTodosOptions {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export async function getTodos({
  page = 1,
  pageSize = 5,
  sortBy = "createdAt",
  sortOrder = "desc",
}: GetTodosOptions) {
  const skip = (page - 1) * pageSize;

  // whitelist sorting field
  const orderBy: Prisma.TodoOrderByWithRelationInput =
    sortBy === "createdAt"
      ? { createdAt: sortOrder }
      : sortBy === "title"
        ? { title: sortOrder }
        : { completed: sortOrder };

  const [items, totalItems] = await Promise.all([
    prisma.todo.findMany({
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.todo.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
    sortBy,
    sortOrder,
  };
}
