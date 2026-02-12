import { Todo } from "../entities/Todo";

export type Filter = "all" | "active" | "completed";

export function filterTodos(todos: Todo[], filter: Filter) {
  switch (filter) {
    case "active":
      return todos.filter((t) => !t.completed);
    case "completed":
      return todos.filter((t) => t.completed);
    default:
      return todos;
  }
}
