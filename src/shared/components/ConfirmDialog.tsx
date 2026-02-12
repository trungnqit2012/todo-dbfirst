type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* DIALOG */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>

        {description && (
          <p className="text-sm text-slate-500 mb-4">{description}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="
              px-4 py-2 rounded-lg
              bg-slate-100 hover:bg-slate-200
              transition cursor-pointer
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-lg
              bg-red-600 text-white hover:bg-red-700
              transition cursor-pointer
            "
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
