import { supabase } from "../../../infrastructure/supabase/supabaseClient";
import type { Todo } from "../domain/entities/Todo";

export const todoService = {
  async loadTodos(): Promise<Todo[]> {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data ?? [];
  },

  async addTodo(title: string): Promise<void> {
    // Lấy user hiện tại
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase.from("todos").insert({
      title,
      completed: false,
      user_id: user.id, // 👈 bắt buộc cho RLS
    });

    if (error) throw error;
  },

  async toggleTodo(todo: Todo): Promise<Todo> {
    const { data, error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", todo.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async removeTodo(id: string): Promise<void> {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) throw error;
  },
};
