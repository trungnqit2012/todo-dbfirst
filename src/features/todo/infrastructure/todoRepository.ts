import { supabase } from "../../../infrastructure/supabase/supabaseClient";
import { Todo } from "../domain/entities/Todo";

export const todoRepository = {
  async getAll(): Promise<Todo[]> {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async create(title: string) {
    const { error } = await supabase
      .from("todos")
      .insert({ title, completed: false });

    if (error) throw error;
  },

  async update(todo: Todo) {
    const { error } = await supabase
      .from("todos")
      .update({ completed: todo.completed })
      .eq("id", todo.id);

    if (error) throw error;
  },

  async remove(id: string) {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) throw error;
  },
};
