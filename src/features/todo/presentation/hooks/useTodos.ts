import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Todo } from "../../domain/entities/Todo";
import { todoService } from "../../application/todoService";
import { APP_CONFIG } from "../../../../core/config/app.config";

export type Filter = "all" | "active" | "completed";
export type SortBy = "createdAt" | "title" | "status";
export type SortOrder = "asc" | "desc";

export function useTodos() {
  const PAGE_SIZE = APP_CONFIG.PAGE_SIZE;
  const [searchParams, setSearchParams] = useSearchParams();

  /* ==============================
     STATE FROM URL
  ============================== */

  const [page, setPage] = useState(() => {
    const p = Number(searchParams.get("page"));
    return isNaN(p) || p < 1 ? 1 : p;
  });

  const [filter, setFilter] = useState<Filter>(() => {
    return (searchParams.get("filter") as Filter) || "all";
  });

  const [sortBy, setSortBy] = useState<SortBy>(() => {
    return (searchParams.get("sortBy") as SortBy) || "createdAt";
  });

  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    return (searchParams.get("sortOrder") as SortOrder) || "desc";
  });

  const [q, setQ] = useState(() => searchParams.get("q") || "");
  const [debouncedQ, setDebouncedQ] = useState(q);

  const hasMounted = useRef(false);

  /* ==============================
     ERROR (TOAST-READY)
  ============================== */

  const [error, setError] = useState<string | null>(null);

  /* ==============================
     DEBOUNCE SEARCH
  ============================== */

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(q);
      setPage(1);
    }, 300);

    return () => clearTimeout(t);
  }, [q]);

  /* ==============================
     DATA
  ============================== */

  const [todos, setTodos] = useState<Todo[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // ⭐ GLOBAL COUNTS (SOURCE OF TRUTH)
  const [totalActive, setTotalActive] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);

  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<Todo | null>(null);
  const [undoTimer, setUndoTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const hasPendingDelete = !!pendingDelete;

  /* ==============================
     SYNC URL
  ============================== */

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    setSearchParams({
      page: String(page),
      filter,
      sortBy,
      sortOrder,
      q,
    });
  }, [page, filter, sortBy, sortOrder, q, setSearchParams]);

  /* ==============================
     LOAD TODOS (PAGED)
  ============================== */

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await todoService.loadTodosPaged({
          page,
          pageSize: PAGE_SIZE,
          sortBy,
          sortOrder,
          filter,
          q: debouncedQ,
        });

        setTodos(res.items);
        setTotalPages(res.totalPages);

        // ⭐ COUNTS KHÔNG BAO GIỜ DỰA PAGING
        setTotalActive(res.totalActive);
        setTotalCompleted(res.totalCompleted);
      } catch {
        setError("Failed to load todos");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page, filter, sortBy, sortOrder, debouncedQ, PAGE_SIZE]);

  /* ==============================
     DERIVED (DOMAIN-CORRECT)
  ============================== */

  const itemsLeft = totalActive;
  const completedCount = totalCompleted;

  /* ==============================
     ACTIONS
  ============================== */

  async function add(title: string) {
    setIsAdding(true);
    try {
      await todoService.addTodo(title);
      setPage(1);
    } catch {
      setError("Failed to add todo");
    } finally {
      setIsAdding(false);
    }
  }

  async function toggle(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const updated = await todoService.toggleTodo(todo);

      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));

      // optimistic global count update
      if (todo.completed !== updated.completed) {
        setTotalActive((n) => (updated.completed ? n - 1 : n + 1));
        setTotalCompleted((n) => (updated.completed ? n + 1 : n - 1));
      }
    } catch {
      setError("Failed to update todo");
    }
  }

  function remove(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    setDeletingId(id);

    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setPendingDelete(todo);
      setDeletingId(null);

      // optimistic global count update
      if (todo.completed) {
        setTotalCompleted((n) => n - 1);
      } else {
        setTotalActive((n) => n - 1);
      }

      const timer = setTimeout(async () => {
        try {
          await todoService.removeTodo(id);
        } catch {
          setError("Failed to delete todo");
        } finally {
          setPendingDelete(null);
        }
      }, 5000);

      setUndoTimer(timer);
    }, 200);
  }

  function undoDelete() {
    if (!pendingDelete) return;
    if (undoTimer) clearTimeout(undoTimer);

    setTodos((prev) => [pendingDelete, ...prev]);

    // rollback counts
    if (pendingDelete.completed) {
      setTotalCompleted((n) => n + 1);
    } else {
      setTotalActive((n) => n + 1);
    }

    setPendingDelete(null);
  }

  async function clearCompleted() {
    if (totalCompleted === 0) return;

    try {
      for (const todo of todos.filter((t) => t.completed)) {
        await todoService.removeTodo(todo.id);
      }
      setPage(1);
    } catch {
      setError("Failed to clear completed todos");
    }
  }

  function changeSort(nextSortBy: SortBy, nextSortOrder: SortOrder) {
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
    setPage(1);
  }

  function nextPage() {
    setPage((p) => Math.min(p + 1, totalPages));
  }

  function prevPage() {
    setPage((p) => Math.max(p - 1, 1));
  }

  /* ==============================
     RETURN
  ============================== */

  return {
    todos,
    loading,

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

    // 🔔 toast-ready
    error,
    clearError: () => setError(null),
  };
}
