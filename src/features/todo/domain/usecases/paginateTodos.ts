export function paginateTodos<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = (page - 1) * pageSize;

  return {
    totalPages,
    items: items.slice(start, start + pageSize),
  };
}
