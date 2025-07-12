export const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000" // No /api in dev
    : ""; // Use /api in production
