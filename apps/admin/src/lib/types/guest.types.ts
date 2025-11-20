export interface Guest {
	id: string;
	first_name: string;
	last_name: string;
	email: string | null;
	phone: string | null;
	document_type: string;
	document_number: string;
	nationality: string;
	occupation: string | null;
	created_at: string;
	updated_at: string;
}

export interface CreateGuestData {
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
	documentType: string;
	documentNumber: string;
	nationality?: string;
	occupation: string;
}
