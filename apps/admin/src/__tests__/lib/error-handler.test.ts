/** biome-ignore-all lint/suspicious/noExplicitAny: <we need to ignore this because we are using any> */
import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import {
	extractErrorMessage,
	extractValidationErrors,
	isValidationError,
} from "@/lib/error-handler";
import type { ApiErrorResponse } from "@/lib/types/api.types";

describe("error-handler", () => {
	describe("extractErrorMessage", () => {
		it("should extract error message from AxiosError with response.error", () => {
			const errorResponse: ApiErrorResponse = {
				success: false,
				error: "Usuario no encontrado",
			};

			const error = new AxiosError("Request failed");
			error.response = {
				data: errorResponse,
			} as any;

			expect(extractErrorMessage(error)).toBe("Usuario no encontrado");
		});

		it("should extract single validation error message", () => {
			const errorResponse: ApiErrorResponse = {
				success: false,
				errors: [
					{
						field: "email",
						message: "El correo electrónico es requerido",
					},
				],
			};

			const error = new AxiosError("Validation failed");
			error.response = {
				data: errorResponse,
			} as any;

			expect(extractErrorMessage(error)).toBe(
				"El correo electrónico es requerido",
			);
		});

		it("should extract multiple validation error messages", () => {
			const errorResponse: ApiErrorResponse = {
				success: false,
				errors: [
					{
						field: "email",
						message: "El correo electrónico es requerido",
					},
					{
						field: "password",
						message: "La contraseña debe tener al menos 8 caracteres",
					},
				],
			};

			const error = new AxiosError("Validation failed");
			error.response = {
				data: errorResponse,
			} as any;

			expect(extractErrorMessage(error)).toBe(
				"Errores de validación: El correo electrónico es requerido, La contraseña debe tener al menos 8 caracteres",
			);
		});

		it("should handle timeout error (ECONNABORTED)", () => {
			const error = new AxiosError("Request timeout");
			error.code = "ECONNABORTED";

			expect(extractErrorMessage(error)).toBe(
				"La solicitud tardó demasiado. Por favor, intenta de nuevo.",
			);
		});

		it("should handle network error (ERR_NETWORK)", () => {
			const error = new AxiosError("Network Error");
			error.code = "ERR_NETWORK";

			expect(extractErrorMessage(error)).toBe(
				"Error de conexión. Verifica tu internet.",
			);
		});

		it("should use error.message when no response data", () => {
			const error = new AxiosError("Custom error message");
			error.response = undefined;

			expect(extractErrorMessage(error)).toBe("Custom error message");
		});

		it("should return fallback message when AxiosError has no message", () => {
			const error = new AxiosError("");
			error.message = "";

			expect(extractErrorMessage(error)).toBe("Ocurrió un error inesperado");
		});

		it("should extract message from standard Error", () => {
			const error = new Error("Standard error message");

			expect(extractErrorMessage(error)).toBe("Standard error message");
		});

		it("should return string error as-is", () => {
			const error = "String error message";

			expect(extractErrorMessage(error)).toBe("String error message");
		});

		it("should return fallback for unknown error types", () => {
			const error = { someProperty: "value" };

			expect(extractErrorMessage(error)).toBe("Ocurrió un error inesperado");
		});

		it("should prioritize response.error over response.errors", () => {
			const errorResponse: ApiErrorResponse = {
				success: false,
				error: "Error principal",
				errors: [
					{
						field: "email",
						message: "Error secundario",
					},
				],
			};

			const error = new AxiosError("Request failed");
			error.response = {
				data: errorResponse,
			} as any;

			expect(extractErrorMessage(error)).toBe("Error principal");
		});

		it("should handle AxiosError with empty response.data", () => {
			const error = new AxiosError("Request failed");
			error.response = {
				data: {},
			} as any;

			expect(extractErrorMessage(error)).toBe("Request failed");
		});
	});

	describe("extractValidationErrors", () => {
		it("should extract validation errors from AxiosError", () => {
			const errorResponse: ApiErrorResponse = {
				success: false,
				errors: [
					{
						field: "email",
						message: "El correo electrónico es requerido",
					},
					{
						field: "password",
						message: "La contraseña es requerida",
					},
				],
			};

			const error = new AxiosError("Validation failed");
			error.response = {
				data: errorResponse,
			} as any;

			const result = extractValidationErrors(error);

			expect(result).toEqual([
				{
					field: "email",
					message: "El correo electrónico es requerido",
				},
				{
					field: "password",
					message: "La contraseña es requerida",
				},
			]);
		});

		it("should handle validation errors without field", () => {
			const errorResponse: ApiErrorResponse = {
				success: false,
				errors: [
					{
						message: "Error sin campo",
					},
				],
			};

			const error = new AxiosError("Validation failed");
			error.response = {
				data: errorResponse,
			} as any;

			const result = extractValidationErrors(error);

			expect(result).toEqual([
				{
					field: "",
					message: "Error sin campo",
				},
			]);
		});

		it("should return null when no validation errors", () => {
			const errorResponse: ApiErrorResponse = {
				success: false,
				error: "Error general",
			};

			const error = new AxiosError("Request failed");
			error.response = {
				data: errorResponse,
			} as any;

			expect(extractValidationErrors(error)).toBeNull();
		});

		it("should return null when response has empty errors array", () => {
			const errorResponse: ApiErrorResponse = {
				success: false,
				errors: [],
			};

			const error = new AxiosError("Request failed");
			error.response = {
				data: errorResponse,
			} as any;

			expect(extractValidationErrors(error)).toBeNull();
		});

		it("should return null when error is not AxiosError", () => {
			const error = new Error("Standard error");

			expect(extractValidationErrors(error)).toBeNull();
		});

		it("should return null when AxiosError has no response", () => {
			const error = new AxiosError("Network error");
			error.response = undefined;

			expect(extractValidationErrors(error)).toBeNull();
		});

		it("should return null when response.data is undefined", () => {
			const error = new AxiosError("Request failed");
			error.response = {
				data: undefined,
			} as any;

			expect(extractValidationErrors(error)).toBeNull();
		});
	});

	describe("isValidationError", () => {
		it("should return true for validation errors", () => {
			const errorResponse: ApiErrorResponse = {
				success: false,
				errors: [
					{
						field: "email",
						message: "El correo electrónico es requerido",
					},
				],
			};

			const error = new AxiosError("Validation failed");
			error.response = {
				data: errorResponse,
			} as any;

			expect(isValidationError(error)).toBe(true);
		});

		it("should return false for non-validation errors", () => {
			const errorResponse: ApiErrorResponse = {
				success: false,
				error: "Error general",
			};

			const error = new AxiosError("Request failed");
			error.response = {
				data: errorResponse,
			} as any;

			expect(isValidationError(error)).toBe(false);
		});

		it("should return false for standard Error", () => {
			const error = new Error("Standard error");

			expect(isValidationError(error)).toBe(false);
		});

		it("should return false for string error", () => {
			const error = "String error";

			expect(isValidationError(error)).toBe(false);
		});

		it("should return false for unknown error types", () => {
			const error = { someProperty: "value" };

			expect(isValidationError(error)).toBe(false);
		});

		it("should return false for AxiosError with empty errors array", () => {
			const errorResponse: ApiErrorResponse = {
				success: false,
				errors: [],
			};

			const error = new AxiosError("Request failed");
			error.response = {
				data: errorResponse,
			} as any;

			expect(isValidationError(error)).toBe(false);
		});
	});
});
