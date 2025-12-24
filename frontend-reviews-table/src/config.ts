export const API_URL =
  import.meta.env?.VITE_API_URL || "http://localhost:1414/api";

export const ENDPOINTS = {
  REVIEWS: `${API_URL}/reviews`,
};
