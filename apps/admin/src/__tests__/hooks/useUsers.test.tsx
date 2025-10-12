// apps/admin/src/__tests__/hooks/useUsers.test.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { useCreateUser } from "@/hooks/useUsers";
import { usersApi } from "@/lib/api/users";

vi.mock("@/lib/api/users", () => ({
	usersApi: {
		createUser: vi.fn(),
	},
}));

const mockInvalidateQueries = vi.fn();
vi.mock("@tanstack/react-query", async () => {
	const actual = await vi.importActual("@tanstack/react-query");
	return {
		...actual,
		useQueryClient: () => ({
			invalidateQueries: mockInvalidateQueries,
		}),
	};
});

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});

	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe("useUsers", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockInvalidateQueries.mockClear();
	});

	describe("useCreateUser", () => {
		it("should call usersApi.createUser on mutate", async () => {
			const mockUserData = {
				email: "test@example.com",
				password: "password123",
				firstName: "John",
				lastName: "Doe",
				role: "admin",
			};

			(usersApi.createUser as Mock).mockResolvedValue({ id: "123" });

			const { result } = renderHook(() => useCreateUser(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(mockUserData);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});
		});

		it("should invalidate users query on success", async () => {
			const mockUserData = {
				email: "test@example.com",
				password: "password123",
				firstName: "John",
				lastName: "Doe",
				role: "admin",
			};

			(usersApi.createUser as Mock).mockResolvedValue({ id: "123" });

			const { result } = renderHook(() => useCreateUser(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(mockUserData);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(mockInvalidateQueries).toHaveBeenCalledWith({
				queryKey: ["users"],
			});
		});

		it("should log error on failure", async () => {
			const mockUserData = {
				email: "test@example.com",
				password: "password123",
				firstName: "John",
				lastName: "Doe",
				role: "admin",
			};

			(usersApi.createUser as Mock).mockRejectedValue(
				new Error("Error creating user"),
			);

			const { result } = renderHook(() => useCreateUser(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(mockUserData);

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});
		});
	});
});
