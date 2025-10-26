export type DocumentType =
	| "Passport"
	| "National ID"
	| "Identity Card"
	| "Citizenship Card";

export interface CreateGuestRequest {
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
	documentType?: DocumentType;
	documentNumber: string;
	occupation: string;
	nationality?: string;
}
