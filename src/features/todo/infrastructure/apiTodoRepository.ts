import { Todo } from "../domain/entities/Todo";
import { APP_CONFIG } from "../../../core/config/app.config";

/* ==============================
   Types
============================== */

export type SortBy = "createdAt" | "title" | "status";
export type SortOrder = "asc" | "desc";

export interface FetchTodosPagedParams {
  page: number;
  pageSize: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filter?: "all" | "active" | "completed";
  q?: string;
}

export interface FetchTodosPagedResult {
  items: Todo[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;

  // ⭐ GLOBAL COUNTS (KHÔNG BAO GIỜ PAGING)
  totalActive: number;
  totalCompleted: number;

  sortBy: SortBy;
  sortOrder: SortOrder;
}

const API_BASE = APP_CONFIG.API_BASE_URL + "api/todos";

/* ==============================
   Helpers
============================== */

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }
  return res.json();
}

/* ==============================
   READ (PAGED)
============================== */

export async function fetchTodosPaged(
  params: FetchTodosPagedParams,
): Promise<FetchTodosPagedResult> {
  const query = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [k, v]) => {
        if (v !== undefined) acc[k] = String(v);
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  const res = await fetch(`${API_BASE}?${query}`);
  return handleResponse<FetchTodosPagedResult>(res);
}

/* ==============================
   WRITE
============================== */

export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(API_BASE, {
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
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });

  return handleResponse<Todo>(res);
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete todo");
  }
}
