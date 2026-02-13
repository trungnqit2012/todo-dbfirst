import { useRef, useState, useEffect } from "react";
import { useAuth } from "../../auth/presentation/hooks/useAuth";

import { useTodos } from "./hooks/useTodos";
import { useConfirmClearCompleted } from "./hooks/useConfirmClearCompleted";

import { TodoInput } from "./components/TodoInput";
import { TodoFilter } from "./components/TodoFilter";
import { TodoList } from "./components/TodoList";
import { Pagination } from "./components/Pagination";
import { EmptyState } from "./components/EmptyState";
import { EmptySearchState } from "./components/EmptySearchState";
import { UndoToast } from "./components/UndoToast";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { TodoSort } from "./components/TodoSort";
import { ErrorBoundary } from "../../../shared/components/ErrorBoundary";

export function TodoPage() {
  const { user, loading } = useAuth();

  const {
    todos,
    filter,
    setFilter,

    sortBy,
    sortOrder,
    changeSort,

    q,
    setQ,

    itemsLeft,
    completedCount,
    hasPendingDelete,

    add,
    toggle,
    remove,
    clearCompleted,
    isAdding,

    page,
    totalPages,
    setPage,
    nextPage,
    prevPage,

    pendingDelete,
    undoDelete,
    deletingId,
  } = useTodos();

  const [text, setText] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* ---------- Confirm clear completed ---------- */
  const clearConfirm = useConfirmClearCompleted({
    completedCount,
    onConfirm: () => {
      clearCompleted();
      listRef.current?.focus();
    },
  });

  /* ---------- Handle add ---------- */
  const handleAdd = () => {
    if (!text.trim()) return;
    add(text);
    setText("");
  };

  /* ---------- Focus input after add ---------- */
  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  /* ---------- Loading / Guard ---------- */
  if (loading) return null;
  if (!user) return null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 relative">
          {/* HEADER */}
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Todo App 📝</h1>
            <span className="text-sm text-slate-600 hidden sm:inline">
              {user.email}
            </span>
          </header>

          {/* ADD INPUT */}
          <TodoInput
            ref={inputRef}
            value={text}
            onChange={setText}
            onSubmit={handleAdd}
            isAdding={isAdding}
          />

          {/* SEARCH */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search todos..."
              disabled={hasPendingDelete}
              className="
                w-full pl-9 pr-3 py-2 text-sm
                border border-slate-300 rounded-md
                transition
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              "
            />
          </div>

          {/* STATS + SORT + FILTER (GRID FIX) */}
          <div className="grid grid-cols-[auto_1fr] items-center mb-4 text-sm text-slate-500 gap-3">
            {/* LEFT: ITEMS LEFT */}
            <span className="whitespace-nowrap">{itemsLeft} items left</span>

            {/* RIGHT: SORT + FILTER */}
            <div className="flex items-center gap-2 justify-end flex-wrap">
              <TodoSort
                value={{ sortBy, sortOrder }}
                onChange={changeSort}
                disabled={hasPendingDelete}
              />

              <TodoFilter
                value={filter}
                onChange={setFilter}
                completedCount={completedCount}
                disabled={hasPendingDelete}
                onClearCompleted={clearConfirm.openConfirm}
              />
            </div>
          </div>

          {/* LIST */}
          {todos.length === 0 ? (
            q ? (
              <EmptySearchState q={q} />
            ) : (
              <EmptyState />
            )
          ) : (
            <>
              <div ref={listRef} tabIndex={-1}>
                <TodoList
                  todos={todos}
                  onToggle={toggle}
                  onDelete={remove}
                  deletingId={deletingId}
                  highlight={q}
                />
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                disabled={hasPendingDelete}
                onPageChange={setPage}
                onPrev={prevPage}
                onNext={nextPage}
              />
            </>
          )}

          {/* CONFIRM CLEAR */}
          <ConfirmDialog
            open={clearConfirm.open}
            title={`Clear ${completedCount} completed items?`}
            description="This action cannot be undone."
            confirmText="Clear"
            cancelText="Cancel"
            onCancel={clearConfirm.closeConfirm}
            onConfirm={clearConfirm.confirm}
          />

          {/* UNDO TOAST */}
          {pendingDelete && (
            <UndoToast message="Todo deleted" onUndo={undoDelete} />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
