import { useRef, useState, useEffect } from "react";
import { useAuth } from "../../auth/presentation/hooks/useAuth";
import { authService } from "../../auth/application/authService";

import { useTodos } from "./hooks/useTodos";
import { useConfirmClearCompleted } from "./hooks/useConfirmClearCompleted";

import { TodoInput } from "./components/TodoInput";
import { TodoFilter } from "./components/TodoFilter";
import { TodoList } from "./components/TodoList";
import { Pagination } from "./components/Pagination";
import { EmptyState } from "./components/EmptyState";
import { UndoToast } from "./components/UndoToast";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";

export function TodoPage() {
  const { user, loading } = useAuth();

  const {
    todos,
    filter,
    setFilter,
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
  if (!user) return null; // ProtectedRoute xử lý redirect

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 relative">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Todo App 📝</h1>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="hidden sm:inline">{user.email}</span>

            <button
              onClick={() => authService.logout()}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* INPUT */}
        <TodoInput
          ref={inputRef}
          value={text}
          onChange={setText}
          onSubmit={handleAdd}
          isAdding={isAdding}
        />

        {/* FILTER + STATS */}
        <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
          <span>{itemsLeft} items left</span>

          <TodoFilter
            value={filter}
            onChange={setFilter}
            completedCount={completedCount}
            disabled={hasPendingDelete}
            onClearCompleted={clearConfirm.openConfirm}
          />
        </div>

        {/* LIST */}
        {todos.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div ref={listRef} tabIndex={-1}>
              <TodoList
                todos={todos}
                onToggle={toggle}
                onDelete={remove}
                deletingId={deletingId}
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

        {/* Confirm dialog */}
        <ConfirmDialog
          open={clearConfirm.open}
          title={`Clear ${completedCount} completed items?`}
          description="This action cannot be undone."
          confirmText="Clear"
          cancelText="Cancel"
          onCancel={clearConfirm.closeConfirm}
          onConfirm={clearConfirm.confirm}
        />

        {/* Undo toast */}
        {pendingDelete && (
          <UndoToast message="Todo deleted" onUndo={undoDelete} />
        )}
      </div>
    </div>
  );
}
