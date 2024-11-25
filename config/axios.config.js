import axios from "axios";

const baseURL = process.env.NEXT_BASE_URL_API + "/api"; // Change this if using a diffe // Change this if using a different backend API

export const api = axios.create({
  baseURL,
});
