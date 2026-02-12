import { api } from "../../../infrastructure/api/httpClient";
import { Todo } from "../domain/entities/Todo";

export const todoApi = {
  getAll(): Promise<Todo[]> {
    return api("/api/todos");
  },

  create(title: string): Promise<Todo> {
    return api("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },

  toggle(id: string, completed: boolean): Promise<Todo> {
    return api(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    });
  },

  remove(id: string): Promise<void> {
    return api(`/api/todos/${id}`, {
      method: "DELETE",
    });
  },
};
