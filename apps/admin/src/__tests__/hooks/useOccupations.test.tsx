import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { useOccupations } from "@/hooks/useOccupations";
import { occupationsApi } from "@/lib/api/occupations";
import { OccupationStatus, StayType } from "@/lib/types/occupation.types";

vi.mock("@/lib/api/occupations", () => ({
	occupationsApi: {
		getOccupations: vi.fn(),
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

describe("useOccupations hooks", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockInvalidateQueries.mockClear();
	});

	describe("useOccupations", () => {
		it("should call occupationsApi.getOccupations on query", async () => {
			const mockOccupations = [
				{
					id: "1",
					roomId: "1",
					checkInDatetime: "2021-01-01",
					checkOutDatetime: "2021-01-01",
					stayType: StayType.NIGHTLY,
					numberOfGuests: 2,
					totalPrice: 100,
					basePrice: 100,
					discountAmount: 0,
					status: OccupationStatus.RESERVED,
					createdAt: "2021-01-01",
					updatedAt: "2021-01-01",
				},
				{
					id: "2",
					roomId: "2",
					checkInDatetime: "2021-01-01",
					checkOutDatetime: "2021-01-01",
					stayType: StayType.NIGHTLY,
					numberOfGuests: 2,
					totalPrice: 100,
					basePrice: 100,
					discountAmount: 0,
					status: OccupationStatus.RESERVED,
					createdAt: "2021-01-01",
					updatedAt: "2021-01-01",
				},
			];

			(occupationsApi.getOccupations as Mock).mockResolvedValue({
				data: mockOccupations,
			});

			const { result } = renderHook(() => useOccupations(), {
				wrapper: createWrapper(),
			});

			result.current.refetch();

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(result.current.data).toEqual({ data: mockOccupations });
		});
	});
});
