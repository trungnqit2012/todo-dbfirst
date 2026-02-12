import type { Todo } from "../../domain/entities/Todo";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
};

export function TodoItem({ todo, onToggle, onDelete, isDeleting }: Props) {
  return (
    <li
      className={`
        flex items-center gap-3
        px-4 py-3 rounded-xl
        bg-slate-50
        transition-all duration-200 ease-out
        ${todo.completed ? "opacity-70 scale-[0.98]" : ""}
        ${isDeleting ? "opacity-0 translate-x-4 scale-95" : ""}
      `}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="
          w-4 h-4
          rounded-md
          border border-slate-300
          accent-blue-600
          cursor-pointer
          transition-all duration-150
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          active:scale-90
        "
      />

      <span
        className={`
          flex-1 min-w-0 break-words
          transition-all duration-200
          ${todo.completed ? "line-through text-slate-400" : "text-slate-700"}
        `}
      >
        {todo.title}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="
          text-slate-400 hover:text-red-500
          transition-transform duration-150
          hover:scale-110
          active:scale-95 cursor-pointer
        "
        aria-label="Delete todo"
      >
        ✕
      </button>
    </li>
  );
}
