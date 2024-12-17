import { API_BASE_URL } from "@/utils/constants";
import axios from "axios";

const baseURL = API_BASE_URL;

export const api = axios.create({
  baseURL,
});
