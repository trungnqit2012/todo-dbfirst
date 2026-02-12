import { Todo } from "../domain/entities/Todo";

const API_BASE = "http://localhost:4000/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }
  return res.json();
}

export const todoService = {
  async loadTodos(): Promise<Todo[]> {
    const res = await fetch(`${API_BASE}/todos`);
    return handleResponse<Todo[]>(res);
  },

  async addTodo(title: string): Promise<Todo> {
    const res = await fetch(`${API_BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    return handleResponse<Todo>(res);
  },

  async toggleTodo(todo: Todo): Promise<Todo> {
    const res = await fetch(`${API_BASE}/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        completed: !todo.completed,
      }),
    });

    return handleResponse<Todo>(res);
  },

  async removeTodo(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete todo");
    }
  },
};
