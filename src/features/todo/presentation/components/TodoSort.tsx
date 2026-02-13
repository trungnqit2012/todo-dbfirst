import { inputBase } from "../../../../shared/styles/input";

type SortBy = "createdAt" | "title" | "status";
type SortOrder = "asc" | "desc";

type SortOption = {
  label: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
};

const OPTIONS: SortOption[] = [
  { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Oldest", sortBy: "createdAt", sortOrder: "asc" },
  { label: "Title A → Z", sortBy: "title", sortOrder: "asc" },
  { label: "Title Z → A", sortBy: "title", sortOrder: "desc" },
  { label: "Status (Active first)", sortBy: "status", sortOrder: "asc" },
];

interface TodoSortProps {
  value: {
    sortBy: SortBy;
    sortOrder: SortOrder;
  };
  onChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  disabled?: boolean;
}

export function TodoSort({ value, onChange, disabled = false }: TodoSortProps) {
  return (
    <select
      className={`${inputBase} px-2 py-1 text-sm`}
      disabled={disabled}
      value={`${value.sortBy}:${value.sortOrder}`}
      onChange={(e) => {
        const [sortBy, sortOrder] = e.target.value.split(":") as [
          SortBy,
          SortOrder,
        ];

        onChange(sortBy, sortOrder);
      }}
    >
      {OPTIONS.map((o) => (
        <option
          key={`${o.sortBy}:${o.sortOrder}`}
          value={`${o.sortBy}:${o.sortOrder}`}
        >
          {o.label}
        </option>
      ))}
    </select>
  );
}
