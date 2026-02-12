import { supabase } from "../../../infrastructure/supabase/supabaseClient";
import type { User } from "@supabase/supabase-js";

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw error ?? new Error("Login failed");
    }

    return data.user;
  },

  async logout() {
    await supabase.auth.signOut();
  },

  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.user ?? null;
  },
};
