import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { occupationsApiServer } from "@/lib/api/occupations.server";
import apiServer from "@/lib/axios.server";
import {
	type Occupation,
	OccupationStatus,
	StayType,
} from "@/lib/types/occupation.types";

vi.mock("@/lib/axios.server", () => ({
	default: {
		post: vi.fn(),
		get: vi.fn(),
	},
}));

describe("occupationsApi", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getOccupations", () => {
		it("should call GET /get-occupations", async () => {
			const mockOccupations: Occupation[] = [
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
			];

			const mockResponse = {
				data: { data: mockOccupations },
			};

			(apiServer.get as Mock).mockResolvedValue(mockResponse);

			const result = await occupationsApiServer.getOccupations();

			expect(apiServer.get).toHaveBeenCalledWith("/get-occupations");
			expect(result).toEqual(mockResponse.data.data);
		});

		it("should handle API errors", async () => {
			const mockError = new AxiosError("API Error");
			(apiServer.get as Mock).mockRejectedValue(mockError);

			await expect(occupationsApiServer.getOccupations()).rejects.toThrow(
				"API Error",
			);
		});
	});
});
