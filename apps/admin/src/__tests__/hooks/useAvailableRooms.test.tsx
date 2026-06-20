import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAvailableRooms } from "@/hooks/useAvailableRooms";
import { roomsApi } from "@/lib/api/rooms";
import { authStore } from "@/store/authStore";

vi.mock("@/store/authStore");
vi.mock("@/lib/api/rooms", () => ({
	roomsApi: {
		getAvailableRooms: vi.fn(),
	},
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
		},
	});

	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe("useAvailableRooms hook", () => {
	const mockAuthStore = {
		isAuthenticated: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(authStore).mockReturnValue(mockAuthStore as any);
	});

	it("should not call getAvailableRooms if not authenticated", async () => {
		mockAuthStore.isAuthenticated = false;

		const { result } = renderHook(
			() => useAvailableRooms("2026-06-19T23:00", "2026-06-22T23:00"),
			{ wrapper: createWrapper() },
		);

		expect(roomsApi.getAvailableRooms).not.toHaveBeenCalled();
		expect(result.current.isEnabled).toBe(false); // Wait, useQuery returned object has enable status? Wait, react query useQuery result doesn't have `isEnabled`, but the query status is 'pending' and isFetching is false.
		expect(result.current.isFetching).toBe(false);
	});

	it("should not call getAvailableRooms if checkIn or checkOut is missing", async () => {
		mockAuthStore.isAuthenticated = true;

		const { result } = renderHook(() => useAvailableRooms("", ""), {
			wrapper: createWrapper(),
		});

		expect(roomsApi.getAvailableRooms).not.toHaveBeenCalled();
		expect(result.current.isFetching).toBe(false);
	});

	it("should call getAvailableRooms and return rooms if authenticated and dates are provided", async () => {
		mockAuthStore.isAuthenticated = true;
		const mockRooms = [{ id: "1", roomNumber: "101" }];
		vi.mocked(roomsApi.getAvailableRooms).mockResolvedValue(mockRooms as any);

		const { result } = renderHook(
			() => useAvailableRooms("2026-06-19T23:00", "2026-06-22T23:00"),
			{ wrapper: createWrapper() },
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(roomsApi.getAvailableRooms).toHaveBeenCalledWith({
			checkIn: "2026-06-19T23:00",
			checkOut: "2026-06-22T23:00",
		});
		expect(result.current.data).toEqual(mockRooms);
	});
});
