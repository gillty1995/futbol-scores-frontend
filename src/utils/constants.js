export const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
console.log("Base URL:", baseUrl);

if (import.meta.env.NODE_ENV === "production") {
  console.log("Running in production mode");
}
