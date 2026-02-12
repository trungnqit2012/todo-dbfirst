import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { Todo } from "../../domain/entities/Todo";
import { Filter, filterTodos } from "../../domain/usecases/filterTodos";
import { paginateTodos } from "../../domain/usecases/paginateTodos";
import { todoService } from "../../application/todoService";
import { APP_CONFIG } from "../../../../core/config/app.config";

export function useTodos() {
  const PAGE_SIZE = APP_CONFIG.PAGE_SIZE;
  const [searchParams, setSearchParams] = useSearchParams();

  /* ==============================
     INITIAL STATE (LAZY INIT)
  ============================== */

  const [page, setPage] = useState(() => {
    const p = Number(searchParams.get("page"));
    return isNaN(p) || p < 1 ? 1 : p;
  });

  const [filter, setFilter] = useState<Filter>(() => {
    return (searchParams.get("filter") as Filter) || "all";
  });

  const hasMounted = useRef(false);

  /* ==============================
     TODOS STATE
  ============================== */

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<Todo | null>(null);

  const [undoTimer, setUndoTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const hasPendingDelete = !!pendingDelete;

  /* ==============================
     SYNC STATE → URL (NO searchParams dep)
  ============================== */

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    setSearchParams({
      page: String(page),
      filter,
    });
  }, [page, filter, setSearchParams]);

  /* ==============================
     LOAD TODOS
  ============================== */

  useEffect(() => {
    async function load() {
      try {
        const data = await todoService.loadTodos();
        setTodos(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ==============================
     DERIVED
  ============================== */

  const filteredTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  const { items: pagedTodos, totalPages } = useMemo(
    () => paginateTodos(filteredTodos, page, PAGE_SIZE),
    [filteredTodos, page],
  );

  const itemsLeft = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos],
  );

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos],
  );

  /* ==============================
     ACTIONS
  ============================== */

  async function add(title: string) {
    setIsAdding(true);
    try {
      await todoService.addTodo(title);
      const fresh = await todoService.loadTodos();
      setTodos(fresh);
      setPage(1); // reset về page 1 khi add
    } finally {
      setIsAdding(false);
    }
  }

  async function toggle(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updated = await todoService.toggleTodo(todo);

    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  function remove(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    setDeletingId(id);

    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id));

      setPendingDelete(todo);
      setDeletingId(null);

      const timer = setTimeout(async () => {
        await todoService.removeTodo(id);
        setPendingDelete(null);
      }, 5000);

      setUndoTimer(timer);
    }, 200);
  }

  function undoDelete() {
    if (!pendingDelete) return;

    if (undoTimer) clearTimeout(undoTimer);

    setTodos((prev) => [pendingDelete, ...prev]);
    setPendingDelete(null);
  }

  async function clearCompleted() {
    const completed = todos.filter((t) => t.completed);

    for (const todo of completed) {
      await todoService.removeTodo(todo.id);
    }

    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  function nextPage() {
    setPage((p) => Math.min(p + 1, totalPages));
  }

  function prevPage() {
    setPage((p) => Math.max(p - 1, 1));
  }

  /* ==============================
     SAFE CLAMP (after data exists)
  ============================== */

  useEffect(() => {
    if (todos.length > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages, todos.length]);

  /* ==============================
     RETURN
  ============================== */

  return {
    todos: pagedTodos,
    loading,

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
  };
}
