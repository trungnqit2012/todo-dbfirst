import { forwardRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isAdding: boolean;
}

export const TodoInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, onSubmit, isAdding }, ref) => {
    const maxLength = 120;

    return (
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            ref={ref}
            value={value}
            maxLength={maxLength}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            placeholder="Nhập việc cần làm..."
            className="flex-1 px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={onSubmit}
            disabled={!value.trim() || isAdding}
            className="px-4 py-2 rounded-xl bg-blue-500 text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            + Add
          </button>
        </div>

        <div className="text-right text-xs text-slate-400 mt-1">
          {value.length}/{maxLength}
        </div>
      </div>
    );
  },
);

TodoInput.displayName = "TodoInput";
