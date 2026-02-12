import { deleteTodo } from "../infrastructure/apiTodoRepository";

export function removeTodo(id: string) {
  return deleteTodo(id);
}
