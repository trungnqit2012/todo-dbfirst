import {
  fetchTodosPaged,
  FetchTodosPagedParams,
  FetchTodosPagedResult,
} from "../infrastructure/apiTodoRepository";

/* ==============================
   Re-export types cho layer trên
============================== */

export type SortBy = FetchTodosPagedParams["sortBy"];
export type SortOrder = FetchTodosPagedParams["sortOrder"];

export type GetTodosParams = FetchTodosPagedParams;
export type GetTodosResult = FetchTodosPagedResult;

/* ==============================
   Use case
============================== */

export async function getTodos(
  params: GetTodosParams,
): Promise<GetTodosResult> {
  return fetchTodosPaged(params);
}
