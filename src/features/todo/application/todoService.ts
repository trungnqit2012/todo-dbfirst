import { Todo } from "../domain/entities/Todo";
import {
  fetchTodosPaged,
  createTodo,
  deleteTodo,
  toggleTodo,
  SortBy,
  SortOrder,
} from "../infrastructure/apiTodoRepository";

/* ==============================
   Types
============================== */

export interface LoadTodosPagedParams {
  page: number;
  pageSize: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filter?: "all" | "active" | "completed";
  q?: string;
}

export interface LoadTodosPagedResult {
  items: Todo[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;

  // ⭐ MUST HAVE
  totalActive: number;
  totalCompleted: number;

  sortBy: SortBy;
  sortOrder: SortOrder;
}

/* ==============================
   Service
============================== */

export const todoService = {
  async loadTodosPaged(
    params: LoadTodosPagedParams,
  ): Promise<LoadTodosPagedResult> {
    return fetchTodosPaged(params);
  },

  async addTodo(title: string): Promise<Todo> {
    return createTodo(title);
  },

  async toggleTodo(todo: Todo): Promise<Todo> {
    return toggleTodo(todo.id, !todo.completed);
  },

  async removeTodo(id: string): Promise<void> {
    return deleteTodo(id);
  },
};
