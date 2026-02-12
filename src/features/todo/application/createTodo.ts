import { createTodo } from "../infrastructure/apiTodoRepository";

export function addTodo(title: string) {
  return createTodo(title);
}
