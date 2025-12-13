import { io } from "socket.io-client";

// Use env backend OR fallback to localhost
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const socket = io(BACKEND_URL, {
  autoConnect: true,
});
