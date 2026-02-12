import { useState } from "react";

interface UseConfirmClearCompletedOptions {
  completedCount: number;
  onConfirm: () => void;
}

export function useConfirmClearCompleted(
  options: UseConfirmClearCompletedOptions,
) {
  const { completedCount, onConfirm } = options;

  const [open, setOpen] = useState(false);

  const openConfirm = () => {
    if (completedCount === 0) return; // không mở nếu không có item completed
    setOpen(true);
  };

  const closeConfirm = () => {
    setOpen(false);
  };

  const confirm = () => {
    onConfirm();
    setOpen(false);
  };

  return {
    open,
    openConfirm,
    closeConfirm,
    confirm,
  };
}
