import type { Todo } from "../../domain/entities/Todo";
import { TodoItem } from "./TodoItem";

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

export function TodoList({ todos, onToggle, onDelete, deletingId }: Props) {
  if (todos.length === 0) return null;

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          isDeleting={deletingId === todo.id}
        />
      ))}
    </ul>
  );
}
