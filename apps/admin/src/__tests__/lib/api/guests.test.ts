import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { guestsApi } from "@/lib/api/guests";
import api from "@/lib/axios";
import type { CreateGuestData, Guest } from "@/lib/types/guest.types";

vi.mock("@/lib/axios", () => ({
	default: {
		post: vi.fn(),
		get: vi.fn(),
	},
}));

describe("guestsApi", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("createGuest", () => {
		it("should call POST /create-guest", async () => {
			const mockGuestData: CreateGuestData = {
				firstName: "John",
				lastName: "Doe",
				email: "john.doe@example.com",
				phone: "1234567890",
				documentType: "National ID",
				documentNumber: "1234567890",
				occupation: "Software Engineer",
			};

			const mockResponse = {
				data: { id: "1", ...mockGuestData },
			};

			(api.post as Mock).mockResolvedValue(mockResponse);

			const result = await guestsApi.createGuest(mockGuestData);

			expect(api.post).toHaveBeenCalledWith("/create-guest", mockGuestData);
			expect(result).toEqual(mockResponse.data);
		});

		it("should handle API errors", async () => {
			const mockGuestData: CreateGuestData = {
				firstName: "John",
				lastName: "Doe",
				email: "john.doe@example.com",
				phone: "1234567890",
				documentType: "National ID",
				documentNumber: "1234567890",
				occupation: "Software Engineer",
			};

			const mockError = new AxiosError("API Error");
			(api.post as Mock).mockRejectedValue(mockError);

			await expect(guestsApi.createGuest(mockGuestData)).rejects.toThrow(
				"API Error",
			);
		});
	});

	describe("getGuest", () => {
		it("should call GET /get-guest/:id", async () => {
			const mockGuest: Guest = {
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
			};
			const mockResponse = {
				data: mockGuest,
			};

			(api.get as Mock).mockResolvedValue(mockResponse);

			const result = await guestsApi.getGuest("1");

			expect(api.get).toHaveBeenCalledWith("/get-guest/1");
			expect(result).toEqual(mockResponse.data);
		});

		it("should handle API errors", async () => {
			const mockError = new AxiosError("API Error");
			(api.get as Mock).mockRejectedValue(mockError);

			await expect(guestsApi.getGuest("1")).rejects.toThrow("API Error");
		});
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

			(api.get as Mock).mockResolvedValue(mockResponse);

			const result = await guestsApi.getGuests();

			expect(api.get).toHaveBeenCalledWith("/get-guests");
			expect(result).toEqual(mockResponse.data.data);
		});

		it("should handle API errors", async () => {
			const mockError = new AxiosError("API Error");
			(api.get as Mock).mockRejectedValue(mockError);

			await expect(guestsApi.getGuests()).rejects.toThrow("API Error");
		});
	});
});
