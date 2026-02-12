import { useEffect } from "react";

interface Props {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination({
  page,
  totalPages,
  disabled,
  onPageChange,
  onPrev,
  onNext,
}: Props) {
  // 🔥 Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (disabled) return;

      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onPrev, onNext, disabled]);

  // ❗ Early return phải nằm SAU hook
  if (totalPages <= 1) return null;

  // 🔥 Create page window
  const range = 2; // số trang hai bên current
  const start = Math.max(1, page - range);
  const end = Math.min(totalPages, page + range);

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6 text-sm">
      {/* Prev */}
      <button
        onClick={onPrev}
        disabled={page === 1 || disabled}
        className="
          px-3 py-1.5 rounded-xl
          bg-slate-100 text-slate-600
          hover:bg-slate-200
          disabled:opacity-40
          transition cursor-pointer disabled:cursor-not-allowed
        "
      >
        Prev
      </button>

      {/* First + dots */}
      {start > 1 && (
        <>
          <PageButton pageNumber={1} current={page} onClick={onPageChange} />
          {start > 2 && <span className="px-1 text-slate-400">…</span>}
        </>
      )}

      {/* Page window */}
      {pages.map((p) => (
        <PageButton
          key={p}
          pageNumber={p}
          current={page}
          onClick={onPageChange}
        />
      ))}

      {/* Last + dots */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-slate-400">…</span>
          )}
          <PageButton
            pageNumber={totalPages}
            current={page}
            onClick={onPageChange}
          />
        </>
      )}

      {/* Next */}
      <div className="relative group">
        <button
          onClick={onNext}
          disabled={page === totalPages || disabled}
          className="
            px-3 py-1.5 rounded-xl
            bg-slate-100 text-slate-600
            hover:bg-slate-200
            disabled:opacity-40
            transition cursor-pointer disabled:cursor-not-allowed
          "
        >
          Next
        </button>

        {/* Tooltip */}
        <div
          className="
            absolute -top-10 left-1/2 -translate-x-1/2
            bg-slate-800 text-white text-xs
            px-3 py-1.5 rounded-lg
            opacity-0 group-hover:opacity-100
            transition pointer-events-none whitespace-nowrap
          "
        >
          Use ← → to navigate
        </div>
      </div>
    </div>
  );
}

function PageButton({
  pageNumber,
  current,
  onClick,
}: {
  pageNumber: number;
  current: number;
  onClick: (p: number) => void;
}) {
  const isActive = pageNumber === current;

  return (
    <button
      onClick={() => onClick(pageNumber)}
      className={`
        px-3 py-1.5 rounded-xl transition cursor-pointer disabled:cursor-not-allowed
        ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }
      `}
    >
      {pageNumber}
    </button>
  );
}
