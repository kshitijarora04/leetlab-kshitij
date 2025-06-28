import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAction = create((set) => ({
  isDeletingproblem: false,
  onDeleteProblem: async (id) => {
    try {
      set({ isDeletingproblem: true });
      const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Error deleting Problem");
    } finally {
      set({ isDeletingproblem: false });
    }
  },
}));
