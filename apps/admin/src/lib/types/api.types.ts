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
