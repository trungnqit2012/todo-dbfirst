import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

type Props = {
  children: ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            borderRadius: "12px",
            background: "#fff",
            color: "#334155",
          },
        }}
      />
      {children}
    </>
  );
}
