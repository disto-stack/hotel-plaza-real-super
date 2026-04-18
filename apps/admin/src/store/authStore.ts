import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types/user.types";

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	setUser: (user: User | null) => void;
	setToken: (token: string | null) => void;
	setLoading: (loading: boolean) => void;
	logout: () => void;
}

export const authStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
			setUser: (user) => set({ user, isAuthenticated: !!user }),
			setToken: (token) => set({ token }),
			setLoading: (isLoading) => set({ isLoading }),
			logout: () =>
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					isLoading: false,
				}),
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
