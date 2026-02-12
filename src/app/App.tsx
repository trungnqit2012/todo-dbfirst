import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppProviders } from "./providers";
import { AuthGate } from "../features/auth/presentation/components/AuthGate";

export default function App() {
  return (
    <AppProviders>
      <AuthGate>
        <RouterProvider router={router} />
      </AuthGate>
    </AppProviders>
  );
}
