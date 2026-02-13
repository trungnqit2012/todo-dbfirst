export function EmptySearchState({ q }: { q: string }) {
  return (
    <div className="py-10 text-center text-slate-500">
      <p className="text-sm">
        No results for <span className="font-medium text-slate-700">“{q}”</span>
      </p>
    </div>
  );
}
