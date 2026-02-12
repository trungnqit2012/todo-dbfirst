type Props = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "No todos yet",
  description = "Start by adding your first task above.",
}: Props) {
  return (
    <div className="py-10 text-center text-slate-500">
      <div className="mb-2 text-lg font-medium">{title}</div>

      <p className="text-sm">{description}</p>
    </div>
  );
}
