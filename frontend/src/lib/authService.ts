import { supabase } from "./supabaseClient";

export const signUp = async (
  email: string,
  password: string
): Promise<{ error?: string }> => {
  if (!email || !password) return { error: "Email and password are required." };
  if (!email.includes("@")) return { error: "Invalid email format." };
  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };

  const { error } = await supabase.auth.signUp({ email, password });
  return { error: error?.message };
};

export const signIn = async (
  email: string,
  password: string
): Promise<{ error?: string }> => {
  if (!email || !password) return { error: "Email and password are required." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message };
};

export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user ?? null;
};
