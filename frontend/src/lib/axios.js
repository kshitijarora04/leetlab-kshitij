import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8000/api/v1"
      : "https://leetlab-kshitij-8t9i.vercel.app/api/v1",
  withCredentials: true,
});
