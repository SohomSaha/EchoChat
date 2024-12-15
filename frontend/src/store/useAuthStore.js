import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log(error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
        const response=await axiosInstance.post('/auth/signup',data);
        set({authUser: response.data})
        toast.success("Account created successfully");
        Navigate("/");
    } catch (error) {
        toast.error(error.response.data.message);  
      }finally {
        set({ isSigningUp: false });
      }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
      Navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    },
    login: async(data) => {
        set({ isLoggingIn: true });
        try {
          const res= await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
        } catch (error) {
          toast.error(error.response.data.message);
        }
        finally {
          set({ isLoggingIn: false });
        }
    },
    updateProfile: async (data) => {
      
    }
}));
