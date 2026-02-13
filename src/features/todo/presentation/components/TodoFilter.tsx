interface Props {
  value: string;
  onChange: (value: "all" | "active" | "completed") => void;
  completedCount: number;
  disabled?: boolean;
  onClearCompleted: () => void;
}

export function TodoFilter({
  value,
  onChange,
  completedCount,
  disabled,
  onClearCompleted,
}: Props) {
  const focusRing =
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1";

  const baseBtn =
    "px-3 py-1 rounded-lg text-sm transition cursor-pointer " + focusRing;

  const activeStyle = "bg-blue-100 text-blue-700";
  const inactiveStyle = "bg-slate-100 text-slate-600 hover:bg-slate-200";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange("all")}
        className={`${baseBtn} ${
          value === "all" ? activeStyle : inactiveStyle
        }`}
      >
        All
      </button>

      <button
        onClick={() => onChange("active")}
        className={`${baseBtn} ${
          value === "active" ? activeStyle : inactiveStyle
        }`}
      >
        Active
      </button>

      <button
        onClick={() => onChange("completed")}
        className={`${baseBtn} ${
          value === "completed" ? activeStyle : inactiveStyle
        }`}
      >
        Completed
      </button>

      {/* CLEAR */}
      <div className="relative group flex items-center ml-2">
        <button
          onClick={onClearCompleted}
          disabled={disabled || completedCount === 0}
          className="
            whitespace-nowrap
            text-red-500 hover:text-red-600 text-sm
            disabled:opacity-40 disabled:cursor-not-allowed
            transition cursor-pointer 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
          "
        >
          Clear ({completedCount})
        </button>

        {/* TOOLTIP */}
        {completedCount > 0 && (
          <div
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                       bg-slate-800 text-white text-xs px-3 py-1 rounded-lg
                       opacity-0 group-hover:opacity-100
                       pointer-events-none transition whitespace-nowrap"
          >
            Clear {completedCount} completed todo
          </div>
        )}
      </div>
    </div>
  );
}
