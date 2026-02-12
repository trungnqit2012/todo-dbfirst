import { useNavigate } from "react-router-dom";
import { AuthForm } from "./components/AuthForm";
import { authService } from "../application/authService";

export function AuthPage() {
  const navigate = useNavigate();

  async function handleSubmit(email: string, password: string) {
    await authService.login(email, password);
    navigate("/");
  }

  return <AuthForm onSubmit={handleSubmit} />;
}
