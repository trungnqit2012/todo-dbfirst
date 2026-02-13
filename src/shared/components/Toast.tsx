import { useEffect } from "react";

export function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
        {message}
      </div>
    </div>
  );
}
