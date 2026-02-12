import { useState } from "react";
import { AuthForm } from "./AuthForm";

interface Props {
  children: React.ReactNode;
}

export function AuthGate({ children }: Props) {
  const demoMode = import.meta.env.VITE_DEMO_MODE === "true";

  // ✅ Hook luôn ở top-level
  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem("demo-auth") === "true";
  });

  // ✅ Nếu không phải demo mode → bỏ qua login
  if (!demoMode) {
    return <>{children}</>;
  }

  async function handleLogin(email: string, password: string) {
    if (
      email === import.meta.env.VITE_DEMO_EMAIL &&
      password === import.meta.env.VITE_DEMO_PASSWORD
    ) {
      localStorage.setItem("demo-auth", "true");
      setIsAuth(true);
      return;
    }

    throw new Error("Invalid email or password");
  }

  if (!isAuth) {
    return <AuthForm onSubmit={handleLogin} />;
  }

  return <>{children}</>;
}
