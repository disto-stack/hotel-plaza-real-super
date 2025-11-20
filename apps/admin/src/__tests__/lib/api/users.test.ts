import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { usersApi } from "@/lib/api/users";
import api from "@/lib/axios";
import type { CreateUserData } from "@/lib/types/user.types";

vi.mock("@/lib/axios", () => ({
	default: {
		post: vi.fn(),
	},
}));

describe("usersApi", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("createUser", () => {
		it("should call POST /create-user with correct data", async () => {
			const mockUserData: CreateUserData = {
				email: "test@example.com",
				password: "password123",
				firstName: "John",
				lastName: "Doe",
				role: "admin",
			};

			const mockResponse = {
				data: { id: "123", ...mockUserData },
			};

			(api.post as Mock).mockResolvedValue(mockResponse);

			const result = await usersApi.createUser(mockUserData);

			expect(api.post).toHaveBeenCalledWith("/create-user", mockUserData);
			expect(result).toEqual(mockResponse.data);
		});

		it("should handle API errors", async () => {
			const mockUserData: CreateUserData = {
				email: "test@example.com",
				password: "password123",
				firstName: "John",
				lastName: "Doe",
				role: "admin",
			};

			const mockError = new Error("API Error");
			(api.post as Mock).mockRejectedValue(mockError);

			await expect(usersApi.createUser(mockUserData)).rejects.toThrow(
				"API Error",
			);
		});
	});
});
