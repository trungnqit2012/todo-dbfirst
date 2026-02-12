import { useState } from "react";
import { APP_CONFIG } from "../../../../core/config/app.config";

interface DemoUser {
  email: string;
}

export function useAuth() {
  const [user] = useState<DemoUser | null>(() => {
    if (!APP_CONFIG.DEMO_MODE) return null;

    const isAuth = localStorage.getItem("demo-auth") === "true";
    return isAuth ? { email: APP_CONFIG.DEMO_EMAIL! } : null;
  });

  const [loading] = useState(false);

  return { user, loading };
}
