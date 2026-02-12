import { useNavigate } from "react-router-dom";
import { AuthForm } from "./components/AuthForm";

export function AuthPage() {
  const navigate = useNavigate();

  async function handleSubmit() {
    navigate("/");
  }

  return <AuthForm onSubmit={handleSubmit} />;
}
