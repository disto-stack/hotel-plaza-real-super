// deno-lint-ignore-file no-explicit-any
/** biome-ignore-all lint/complexity/noStaticOnlyClass: <we need to ignore this because we are using static methods> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <we need to ignore this because we are using any> */

import { corsHeaders } from "./cors.ts";

export const HTTP_STATUS_CODES = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	CONFLICT: 409,
	TOO_MANY_REQUESTS: 429,
	INTERNAL_SERVER_ERROR: 500,
};

export const HTTP_METHODS = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE",
	OPTIONS: "OPTIONS",
	PATCH: "PATCH",
};

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	timestamp?: string;
	requestId?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface ErrorDetails {
	field?: string;
	code?: string;
	message: string;
}

export interface ValidationErrorResponse extends ApiResponse {
	errors: ErrorDetails[];
}

export class ResponseBuilder {
	private static generateRequestId(): string {
		return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	static success<T>(
		data: T,
		message: string = "Success",
		status: number = 200,
		requestId?: string,
	): Response {
		const response: ApiResponse<T> = {
			success: true,
			data,
			message,
			timestamp: new Date().toISOString(),
			requestId: requestId || ResponseBuilder.generateRequestId(),
		};

		return new Response(JSON.stringify(response), {
			status,
			headers: {
				"Content-Type": "application/json",
				...corsHeaders,
			},
		});
	}

	static paginated<T>(
		data: T[],
		pagination: {
			page: number;
			limit: number;
			total: number;
		},
		message: string = "Success",
		status: number = HTTP_STATUS_CODES.OK,
	): Response {
		const totalPages = Math.ceil(pagination.total / pagination.limit);

		const response: PaginatedResponse<T> = {
			success: true,
			data,
			message,
			timestamp: new Date().toISOString(),
			requestId: ResponseBuilder.generateRequestId(),
			pagination: {
				...pagination,
				totalPages,
			},
		};

		return new Response(JSON.stringify(response), {
			status,
			headers: {
				"Content-Type": "application/json",
				...corsHeaders,
			},
		});
	}

	static error(
		error: string,
		status: number = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
		details?: any,
		requestId?: string,
	): Response {
		const response: ApiResponse = {
			success: false,
			error,
			timestamp: new Date().toISOString(),
			requestId: requestId || ResponseBuilder.generateRequestId(),
			...(details && { details }),
		};

		return new Response(JSON.stringify(response), {
			status,
			headers: {
				"Content-Type": "application/json",
				...corsHeaders,
			},
		});
	}

	static validationError(
		errors: ErrorDetails[],
		message: string = "Validation failed",
		requestId?: string,
	): Response {
		const response: ValidationErrorResponse = {
			success: false,
			error: message,
			errors,
			timestamp: new Date().toISOString(),
			requestId: requestId || ResponseBuilder.generateRequestId(),
		};

		return new Response(JSON.stringify(response), {
			status: HTTP_STATUS_CODES.BAD_REQUEST,
			headers: {
				"Content-Type": "application/json",
				...corsHeaders,
			},
		});
	}

	static unauthorized(error: string = "Unauthorized"): Response {
		return ResponseBuilder.error(error, HTTP_STATUS_CODES.UNAUTHORIZED);
	}

	static forbidden(error: string = "Forbidden"): Response {
		return ResponseBuilder.error(error, HTTP_STATUS_CODES.FORBIDDEN);
	}

	static notFound(resource: string = "Resource"): Response {
		return ResponseBuilder.error(
			`${resource} not found`,
			HTTP_STATUS_CODES.NOT_FOUND,
		);
	}

	static badRequest(error: string = "Bad Request"): Response {
		return ResponseBuilder.error(error, HTTP_STATUS_CODES.BAD_REQUEST);
	}

	static conflict(error: string = "Conflict"): Response {
		return ResponseBuilder.error(error, HTTP_STATUS_CODES.CONFLICT);
	}

	static tooManyRequests(error: string = "Too Many Requests"): Response {
		return ResponseBuilder.error(error, HTTP_STATUS_CODES.TOO_MANY_REQUESTS);
	}

	static internalServerError(
		error: string = "Internal Server Error",
	): Response {
		return ResponseBuilder.error(
			error,
			HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
		);
	}

	static methodNotAllowed(
		allowedMethods: (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS][] = [
			HTTP_METHODS.GET,
			HTTP_METHODS.POST,
		],
	): Response {
		return new Response(
			JSON.stringify({
				success: false,
				error: "Method not allowed",
				allowedMethods,
				timestamp: new Date().toISOString(),
				requestId: ResponseBuilder.generateRequestId(),
			}),
			{
				status: HTTP_STATUS_CODES.METHOD_NOT_ALLOWED,
				headers: {
					"Content-Type": "application/json",
					Allow: allowedMethods.join(", "),
					...corsHeaders,
				},
			},
		);
	}

	static options(): Response {
		return new Response(null, {
			status: HTTP_STATUS_CODES.OK,
			headers: corsHeaders,
		});
	}

	static created(
		data: any,
		message: string = "Created successfully",
	): Response {
		return ResponseBuilder.success(data, message, HTTP_STATUS_CODES.CREATED);
	}
}

export const createValidationError = (
	field: string,
	message: string,
): ErrorDetails => ({
	field,
	message,
});

export const createFieldError = (
	field: string,
	code: string,
	message: string,
): ErrorDetails => ({
	field,
	code,
	message,
});

export type SuccessResponse<T> = Response & { data: T };
export type ErrorResponse = Response & { error: string };
