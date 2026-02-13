import {
  fetchTodosPaged,
  FetchTodosParams,
  FetchTodosResult,
} from "../infrastructure/apiTodoRepository";

/* ================================
   Re-export types cho layer trên
================================ */

export type SortBy = FetchTodosParams["sortBy"];
export type SortOrder = FetchTodosParams["sortOrder"];

export type GetTodosParams = FetchTodosParams;
export type GetTodosResult = FetchTodosResult;

/* ================================
   Use case
================================ */

export async function getTodos(
  params: GetTodosParams,
): Promise<GetTodosResult> {
  return fetchTodosPaged(params);
}
