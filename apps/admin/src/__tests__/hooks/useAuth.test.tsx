/** biome-ignore-all lint/suspicious/noExplicitAny: For mocking */
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { authStore } from "@/store/authStore";

vi.mock("@/lib/supabase/client");
vi.mock("@/store/authStore");

const mockSingle = vi.fn();
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));

const mockSupabase = {
	auth: {
		getSession: vi.fn(),
		onAuthStateChange: vi.fn(),
		signOut: vi.fn(),
		signInWithPassword: vi.fn(),
	},
	from: mockFrom,
};

const mockUseAuthStore = {
	user: null,
	isAuthenticated: false,
	isLoading: false,
	setUser: vi.fn(),
	setLoading: vi.fn(),
	logout: vi.fn(),
};

describe("useAuth", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(createClient).mockReturnValue(mockSupabase as any);
		vi.mocked(authStore).mockReturnValue(mockUseAuthStore);
	});

	it("should initialize", () => {
		mockSupabase.auth.onAuthStateChange.mockImplementation((_: any) => {
			return {
				data: { subscription: { unsubscribe: vi.fn() } },
			};
		});

		const { result } = renderHook(() => useAuth());

		expect(result.current.signOut).toBeDefined();
		expect(result.current.signIn).toBeDefined();
	});

	it("should load user when the session is active", async () => {
		const mockUser = {
			id: "123",
			email: "test@example.com",
			first_name: "Test",
			last_name: "User",
			role: "admin",
		};

		mockSupabase.auth.getSession.mockResolvedValue({
			data: {
				session: {
					user: {
						id: "123",
						email: "test@example.com",
					},
				},
			},
		});

		mockSupabase.auth.onAuthStateChange.mockImplementation((_: any) => {
			return {
				data: { subscription: { unsubscribe: vi.fn() } },
			};
		});

		mockSingle.mockResolvedValue({
			data: mockUser,
		});

		renderHook(() => useAuth());

		await waitFor(() => {
			expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(true);
		});

		await waitFor(() => {
			expect(mockUseAuthStore.setUser).toHaveBeenCalledWith(mockUser);
		});

		await waitFor(() => {
			expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(false);
		});
	});

	it("should handle when there is no active session", async () => {
		mockSupabase.auth.getSession.mockResolvedValue({
			data: { session: null },
		});

		mockSupabase.auth.onAuthStateChange.mockImplementation((_: any) => {
			return {
				data: { subscription: { unsubscribe: vi.fn() } },
			};
		});

		renderHook(() => useAuth());

		await waitFor(() => {
			expect(mockUseAuthStore.setUser).toHaveBeenCalledWith(null);
		});

		await waitFor(() => {
			expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(false);
		});
	});

	it("should handle authentication events", async () => {
		const mockUser = {
			id: "123",
			email: "test@example.com",
			first_name: "Test",
			last_name: "User",
			role: "admin",
		};

		let authStateChangeCallback: any;

		mockSupabase.auth.onAuthStateChange.mockImplementation((callback: any) => {
			authStateChangeCallback = callback;
			return {
				data: { subscription: { unsubscribe: vi.fn() } },
			};
		});

		mockSupabase.auth.getSession.mockResolvedValue({
			data: { session: null },
		});

		renderHook(() => useAuth());

		if (authStateChangeCallback) {
			await authStateChangeCallback("SIGNED_IN", {
				user: { id: "123", email: "test@example.com" },
			});
		}

		mockSingle.mockResolvedValue({
			data: mockUser,
		});

		await waitFor(() => {
			expect(mockUseAuthStore.setUser).toHaveBeenCalledWith(mockUser);
		});
	});

	it("should handle SIGNED_OUT event", async () => {
		let authStateChangeCallback: any;

		mockSupabase.auth.onAuthStateChange.mockImplementation((callback: any) => {
			authStateChangeCallback = callback;
			return {
				data: { subscription: { unsubscribe: vi.fn() } },
			};
		});

		// Mock de getSession inicial
		mockSupabase.auth.getSession.mockResolvedValue({
			data: { session: null },
		});

		renderHook(() => useAuth());

		if (authStateChangeCallback) {
			await authStateChangeCallback("SIGNED_OUT", null);
		}

		await waitFor(() => {
			expect(mockUseAuthStore.setUser).toHaveBeenCalledWith(null);
		});
	});

	it("should ignore irrelevant events", async () => {
		let authStateChangeCallback: any;

		mockSupabase.auth.onAuthStateChange.mockImplementation((callback: any) => {
			authStateChangeCallback = callback;
			return {
				data: { subscription: { unsubscribe: vi.fn() } },
			};
		});

		mockSupabase.auth.getSession.mockResolvedValue({
			data: { session: null },
		});

		renderHook(() => useAuth());

		if (authStateChangeCallback) {
			await authStateChangeCallback("TOKEN_REFRESHED", {
				user: { id: "123", email: "test@example.com" },
			});
		}

		await waitFor(() => {
			expect(mockUseAuthStore.setUser).toHaveBeenCalledWith(null);
		});

		await waitFor(() => {
			expect(mockUseAuthStore.setUser).toHaveBeenCalledTimes(1);
		});
	});

	it("should sign in correctly", async () => {
		mockSupabase.auth.getSession.mockResolvedValue({
			data: { session: null },
		});

		mockSupabase.auth.onAuthStateChange.mockReturnValue({
			data: { subscription: { unsubscribe: vi.fn() } },
		});

		mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null });

		const { result } = renderHook(() => useAuth());

		await result.current.signIn("test@example.com", "password");

		expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
			email: "test@example.com",
			password: "password",
		});

		expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(true);
		expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(false);
	});

	it("should handle error in sign in", async () => {
		mockSupabase.auth.getSession.mockResolvedValue({
			data: { session: null },
		});

		mockSupabase.auth.onAuthStateChange.mockReturnValue({
			data: { subscription: { unsubscribe: vi.fn() } },
		});

		mockSupabase.auth.signInWithPassword.mockResolvedValue({
			error: {
				message: "Invalid login credentials",
				code: "invalid_credentials",
			},
		});

		const { result } = renderHook(() => useAuth());

		await expect(
			result.current.signIn("test@example.com", "password"),
		).rejects.toThrow("Correo electrónico o contraseña incorrectos");

		expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
			email: "test@example.com",
			password: "password",
		});

		expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(true);
		expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(false);
	});

	it("should handle different error codes in sign in", async () => {
		mockSupabase.auth.getSession.mockResolvedValue({
			data: { session: null },
		});

		mockSupabase.auth.onAuthStateChange.mockReturnValue({
			data: { subscription: { unsubscribe: vi.fn() } },
		});

		mockSupabase.auth.signInWithPassword.mockResolvedValue({
			error: { message: "Email not confirmed", code: "email_not_confirmed" },
		});

		const { result } = renderHook(() => useAuth());

		await expect(
			result.current.signIn("test@example.com", "password"),
		).rejects.toThrow("Correo electrónico no confirmado");

		expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(true);
		expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(false);
	});

	it("should handle unknown error code in sign in", async () => {
		mockSupabase.auth.getSession.mockResolvedValue({
			data: { session: null },
		});

		mockSupabase.auth.onAuthStateChange.mockReturnValue({
			data: { subscription: { unsubscribe: vi.fn() } },
		});

		mockSupabase.auth.signInWithPassword.mockResolvedValue({
			error: { message: "Unknown error", code: "unknown_code" },
		});

		const { result } = renderHook(() => useAuth());

		await expect(
			result.current.signIn("test@example.com", "password"),
		).rejects.toThrow("Ocurrió un error inesperado");

		expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(true);
		expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(false);
	});

	it("should logout correctly", async () => {
		mockSupabase.auth.getSession.mockResolvedValue({
			data: { session: null },
		});

		mockSupabase.auth.onAuthStateChange.mockReturnValue({
			data: { subscription: { unsubscribe: vi.fn() } },
		});

		mockSupabase.auth.signOut.mockResolvedValue({ error: null });

		const originalLocation = window.location;
		delete (window as any).location;
		(window as any).location = { href: "" };

		const { result } = renderHook(() => useAuth());

		await result.current.signOut();

		expect(mockSupabase.auth.signOut).toHaveBeenCalledWith({
			scope: "local",
		});

		expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(true);
		expect(mockUseAuthStore.logout).toHaveBeenCalled();
		expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(false);

		(window as any).location = originalLocation;
	});

	it("should handle error in logout", async () => {
		mockSupabase.auth.getSession.mockResolvedValue({
			data: { session: null },
		});

		mockSupabase.auth.onAuthStateChange.mockReturnValue({
			data: { subscription: { unsubscribe: vi.fn() } },
		});

		mockSupabase.auth.signOut.mockResolvedValue({
			error: { message: "Logout failed", code: "unauthorized" },
		});

		const { result } = renderHook(() => useAuth());

		await expect(result.current.signOut()).rejects.toThrow(
			"No tienes permisos para acceder a esta página",
		);

		expect(mockSupabase.auth.signOut).toHaveBeenCalledWith({
			scope: "local",
		});

		expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(true);
		expect(mockUseAuthStore.setLoading).toHaveBeenCalledWith(false);
		expect(mockUseAuthStore.logout).not.toHaveBeenCalled();
	});

	it("should clean subscription when unmounting", () => {
		const mockUnsubscribe = vi.fn();

		mockSupabase.auth.onAuthStateChange.mockReturnValue({
			data: { subscription: { unsubscribe: mockUnsubscribe } },
		});

		mockSupabase.auth.getSession.mockResolvedValue({
			data: { session: null },
		});

		const { unmount } = renderHook(() => useAuth());

		unmount();

		expect(mockUnsubscribe).toHaveBeenCalled();
	});
});
