import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { useCreateGuest, useGuest, useGuests } from "@/hooks/useGuests";
import { guestsApi } from "@/lib/api/guests";

vi.mock("@/lib/api/guests", () => ({
	guestsApi: {
		createGuest: vi.fn(),
		getGuest: vi.fn(),
		getGuests: vi.fn(),
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

describe("useGuests hooks", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockInvalidateQueries.mockClear();
	});

	describe("useGuests", () => {
		it("should call guestsApi.getGuests on query", async () => {
			const mockGuests = [
				{ id: "1", name: "Guest 1" },
				{ id: "2", name: "Guest 2" },
			];

			(guestsApi.getGuests as Mock).mockResolvedValue({ data: mockGuests });

			const { result } = renderHook(() => useGuests(), {
				wrapper: createWrapper(),
			});

			result.current.refetch();

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual({ data: mockGuests });
		});
	});

	describe("useGuest", () => {
		it("should call guestsApi.getGuest on query", async () => {
			const mockGuest = { id: "1", name: "Guest 1" };
			(guestsApi.getGuest as Mock).mockResolvedValue({ data: mockGuest });

			const { result } = renderHook(() => useGuest("1"), {
				wrapper: createWrapper(),
			});

			result.current.refetch();

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual({ data: mockGuest });
		});
	});

	describe("useCreateGuest", () => {
		it("should call guestsApi.createGuest on mutate", async () => {
			const mockGuestData = {
				firstName: "John",
				lastName: "Doe",
				email: "john.doe@example.com",
				phone: "1234567890",
				documentType: "National ID",
				documentNumber: "1234567890",
				occupation: "Software Engineer",
			};

			(guestsApi.createGuest as Mock).mockResolvedValue({
				id: "123",
				...mockGuestData,
			});

			const { result } = renderHook(() => useCreateGuest(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(mockGuestData);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});
		});

		it("should invalidate guests query on success", async () => {
			const mockGuestData = {
				firstName: "John",
				lastName: "Doe",
				email: "john.doe@example.com",
				phone: "1234567890",
				documentType: "National ID",
				documentNumber: "1234567890",
				occupation: "Software Engineer",
			};

			(guestsApi.createGuest as Mock).mockResolvedValue({ id: "123" });

			const { result } = renderHook(() => useCreateGuest(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(mockGuestData);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(mockInvalidateQueries).toHaveBeenCalledWith({
				queryKey: ["guests"],
			});
		});

		it("should log error on failure", async () => {
			const mockGuestData = {
				firstName: "John",
				lastName: "Doe",
				email: "john.doe@example.com",
				phone: "1234567890",
				documentType: "National ID",
				documentNumber: "1234567890",
				occupation: "Software Engineer",
			};

			(guestsApi.createGuest as Mock).mockRejectedValue(
				new Error("Error creating guest"),
			);

			const { result } = renderHook(() => useCreateGuest(), {
				wrapper: createWrapper(),
			});

			result.current.mutate(mockGuestData);

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});
		});
	});
});
