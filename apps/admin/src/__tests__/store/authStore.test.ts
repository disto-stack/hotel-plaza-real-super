/** biome-ignore-all lint/suspicious/noExplicitAny: For mocking */
import { beforeEach, describe, expect, it } from "vitest";
import { authStore } from "@/store/authStore";

describe("authStore", () => {
	beforeEach(() => {
		authStore.getState().logout();
	});

	describe("Initial state", () => {
		it("should initialize with default values", () => {
			const state = authStore.getState();

			expect(state.user).toBeNull();
			expect(state.isAuthenticated).toBe(false);
			expect(state.isLoading).toBe(false);
		});

		it("should have all required methods", () => {
			const state = authStore.getState();

			expect(typeof state.setUser).toBe("function");
			expect(typeof state.setLoading).toBe("function");
			expect(typeof state.logout).toBe("function");
		});
	});

	describe("setUser", () => {
		it("should set user and update isAuthenticated to true", () => {
			const mockUser = {
				id: "123",
				email: "test@example.com",
				first_name: "Test",
				last_name: "User",
				role: "admin",
				created_at: "2024-01-01",
				updated_at: "2024-01-01",
			};

			authStore.getState().setUser(mockUser);

			const state = authStore.getState();
			expect(state.user).toEqual(mockUser);
			expect(state.isAuthenticated).toBe(true);
		});

		it("should set user to null and update isAuthenticated to false", () => {
			const mockUser = {
				id: "123",
				email: "test@example.com",
				first_name: "Test",
				last_name: "User",
				role: "admin",
				created_at: "2024-01-01",
				updated_at: "2024-01-01",
			};

			authStore.getState().setUser(mockUser);
			expect(authStore.getState().isAuthenticated).toBe(true);

			authStore.getState().setUser(null);

			const state = authStore.getState();
			expect(state.user).toBeNull();
			expect(state.isAuthenticated).toBe(false);
		});

		it("should handle undefined user", () => {
			authStore.getState().setUser(undefined as any);

			const state = authStore.getState();
			expect(state.user).toBeUndefined();
			expect(state.isAuthenticated).toBe(false);
		});
	});

	describe("setLoading", () => {
		it("should set loading to true", () => {
			authStore.getState().setLoading(true);

			expect(authStore.getState().isLoading).toBe(true);
		});

		it("should set loading to false", () => {
			authStore.getState().setLoading(true);
			expect(authStore.getState().isLoading).toBe(true);

			authStore.getState().setLoading(false);
			expect(authStore.getState().isLoading).toBe(false);
		});
	});

	describe("logout", () => {
		it("should reset all state to initial values", () => {
			const mockUser = {
				id: "123",
				email: "test@example.com",
				first_name: "Test",
				last_name: "User",
				role: "admin",
				created_at: "2024-01-01",
				updated_at: "2024-01-01",
			};

			authStore.getState().setUser(mockUser);
			authStore.getState().setLoading(true);

			expect(authStore.getState().user).toEqual(mockUser);
			expect(authStore.getState().isAuthenticated).toBe(true);
			expect(authStore.getState().isLoading).toBe(true);

			authStore.getState().logout();

			const state = authStore.getState();
			expect(state.user).toBeNull();
			expect(state.isAuthenticated).toBe(false);
			expect(state.isLoading).toBe(false);
		});

		it("should work even when state is already reset", () => {
			expect(authStore.getState().user).toBeNull();
			expect(authStore.getState().isAuthenticated).toBe(false);
			expect(authStore.getState().isLoading).toBe(false);

			authStore.getState().logout();

			const state = authStore.getState();
			expect(state.user).toBeNull();
			expect(state.isAuthenticated).toBe(false);
			expect(state.isLoading).toBe(false);
		});
	});

	describe("State updates", () => {
		it("should update state when actions are called", () => {
			const mockUser = {
				id: "123",
				email: "test@example.com",
				first_name: "Test",
				last_name: "User",
				role: "admin",
				created_at: "2024-01-01",
				updated_at: "2024-01-01",
			};

			authStore.getState().setUser(mockUser);

			const state = authStore.getState();
			expect(state.user).not.toBeNull();
			expect(state.isAuthenticated).toBe(true);
		});

		it("should maintain referential stability for unchanged values", () => {
			const mockUser = {
				id: "123",
				email: "test@example.com",
				first_name: "Test",
				last_name: "User",
				role: "admin",
				created_at: "2024-01-01",
				updated_at: "2024-01-01",
			};

			authStore.getState().setUser(mockUser);
			const firstUser = authStore.getState().user;

			authStore.getState().setUser(mockUser);
			const secondUser = authStore.getState().user;

			expect(firstUser).toBe(secondUser);
		});
	});
});
