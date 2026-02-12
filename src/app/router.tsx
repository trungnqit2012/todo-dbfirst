import { createBrowserRouter } from "react-router-dom";

import { AuthPage } from "../features/auth/presentation/AuthPage";
import { TodoPage } from "../features/todo/presentation/TodoPage";
import { ProtectedRoute } from "../features/auth/presentation/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <TodoPage />
      </ProtectedRoute>
    ),
  },
]);
