import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (userData) => {
        set({ isLoading: true });

        // API / Firebase login
        await new Promise((r) => setTimeout(r, 1000));

        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: async () => {
        await AsyncStorage.clear();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
