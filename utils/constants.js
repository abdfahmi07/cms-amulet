export const API_BASE_URL = `${
  process.env.NODE_ENV === "production" ? "https" : "http"
}://${process.env.NEXT_PUBLIC_BASE_URL_STAGING}/api/v1`;

export const SOCKET_BASE_URL = process.env.NEXT_PUBLIC_SOCKET_URL_STAGING;
