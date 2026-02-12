import { todoApi } from "../infrastructure/todoApi";
import { Todo } from "../domain/entities/Todo";

export const todoService = {
  async loadTodos(): Promise<Todo[]> {
    return todoApi.getAll();
  },

  async addTodo(title: string): Promise<Todo> {
    return todoApi.create(title);
  },

  async toggleTodo(todo: Todo): Promise<Todo> {
    return todoApi.toggle(todo.id, !todo.completed);
  },

  async removeTodo(id: string): Promise<void> {
    return todoApi.remove(id);
  },
};
