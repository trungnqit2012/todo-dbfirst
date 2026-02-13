import { Todo } from "../domain/entities/Todo";

const API_BASE = "http://localhost:4000/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }
  return res.json();
}

export type SortBy = "createdAt" | "title" | "status";
export type SortOrder = "asc" | "desc";

export interface FetchTodosParams {
  page: number;
  pageSize: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filter?: "all" | "active" | "completed";
  q?: string;
}

export interface FetchTodosResult {
  items: Todo[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export async function fetchTodosPaged(
  params: FetchTodosParams,
): Promise<FetchTodosResult> {
  const qs = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  if (params.filter) qs.set("filter", params.filter);
  if (params.q) qs.set("q", params.q);

  const res = await fetch(`${API_BASE}/todos?${qs.toString()}`);
  return handleResponse<FetchTodosResult>(res);
}

export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return handleResponse<Todo>(res);
}

export async function toggleTodo(
  id: string,
  completed: boolean,
): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  return handleResponse<Todo>(res);
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete todo");
  }
}
