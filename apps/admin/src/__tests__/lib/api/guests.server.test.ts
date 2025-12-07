import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { guestsApiServer } from "@/lib/api/guests.server";
import apiServer from "@/lib/axios.server";
import type { Guest } from "@/lib/types/guest.types";

vi.mock("@/lib/axios.server", () => ({
	default: {
		get: vi.fn(),
	},
}));

describe("guestsApiServer", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getGuests", () => {
		it("should call GET /get-guests", async () => {
			const mockGuests: Guest[] = [
				{
					id: "1",
					first_name: "John",
					last_name: "Doe",
					email: "john.doe@example.com",
					phone: "1234567890",
					document_type: "National ID",
					document_number: "1234567890",
					nationality: "American",
					occupation: "Software Engineer",
					created_at: "2021-01-01",
					updated_at: "2021-01-01",
				},
			];

			const mockResponse = {
				data: { data: mockGuests },
			};

			(apiServer.get as Mock).mockResolvedValue(mockResponse);

			const result = await guestsApiServer.getGuests();

			expect(apiServer.get).toHaveBeenCalledWith("/get-guests");
			expect(result).toEqual(mockResponse.data.data);
		});

		it("should handle API errors", async () => {
			const mockError = new AxiosError("API Error");
			(apiServer.get as Mock).mockRejectedValue(mockError);

			await expect(guestsApiServer.getGuests()).rejects.toThrow("API Error");
		});
	});
});
