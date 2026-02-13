export const APP_CONFIG = {
  PAGE_SIZE: Number(import.meta.env.VITE_PAGE_SIZE ?? 5),
  UNDO_TIMEOUT: 4000,
  MAX_TODO_TITLE_LENGTH: 120,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  DEMO_MODE: import.meta.env.VITE_DEMO_MODE === "true",
  DEMO_EMAIL: import.meta.env.VITE_DEMO_EMAIL,
};
