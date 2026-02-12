import { fetchTodos } from "../infrastructure/apiTodoRepository";

export function getTodos() {
  return fetchTodos();
}
