interface Props {
  message: string;
  onUndo: () => void;
}

export function UndoToast({ message, onUndo }: Props) {
  return (
    <div
      className="
        fixed bottom-8 left-1/2 -translate-x-1/2
        bg-white text-slate-700
        px-6 py-3 rounded-2xl
        shadow-lg border border-slate-200
        flex items-center gap-4
        animate-fade-in
        z-50
      "
    >
      <span className="text-sm font-medium">{message}</span>

      <button
        onClick={onUndo}
        className="
          text-blue-600 hover:text-blue-700
          font-medium text-sm
          transition-colors cursor-pointer
        "
      >
        Undo
      </button>
    </div>
  );
}
