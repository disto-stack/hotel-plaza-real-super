import { AxiosError } from "axios";

export interface ApiErrorResponse {
	success: false;
	error?: string;
	errors?: Array<{
		field?: string;
		code?: string;
		message: string;
	}>;
	details?: any;
	requestId?: string;
	timestamp?: string;
}

export interface ValidationError {
	field: string;
	message: string;
}

export function extractErrorMessage(error: unknown): string {
	if (error instanceof AxiosError) {
		const response = error.response?.data as ApiErrorResponse | undefined;

		if (response) {
			if (response.error) {
				return response.error;
			}

			if (response.errors && response.errors.length > 0) {
				if (response.errors.length === 1) {
					return response.errors[0].message;
				}

				return `Errores de validación: ${response.errors.map((e) => e.message).join(", ")}`;
			}
		}

		if (error.code === "ECONNABORTED") {
			return "La solicitud tardó demasiado. Por favor, intenta de nuevo.";
		}

		if (error.code === "ERR_NETWORK") {
			return "Error de conexión. Verifica tu internet.";
		}

		return error.message || "Ocurrió un error inesperado";
	}

	if (error instanceof Error) {
		return error.message;
	}

	if (typeof error === "string") {
		return error;
	}

	return "Ocurrió un error inesperado";
}

export function extractValidationErrors(
	error: unknown,
): ValidationError[] | null {
	if (error instanceof AxiosError) {
		const response = error.response?.data as ApiErrorResponse | undefined;

		if (response?.errors && response.errors.length > 0) {
			return response.errors.map((err) => ({
				field: err.field || "",
				message: err.message,
			}));
		}
	}

	return null;
}

export function isValidationError(error: unknown): boolean {
	const validationErrors = extractValidationErrors(error);
	return validationErrors !== null && validationErrors.length > 0;
}
