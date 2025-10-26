import type { CreateGuestRequest, DocumentType } from "../types/guest.type.ts";

export interface Guest {
	id: string;
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
	documentType?: DocumentType;
	documentNumber: string;
	occupation?: string;
	nationality?: string;
	address?: string;
	emergencyContactName?: string;
	emergencyContactPhone?: string;
	specialRequests?: string;
	totalStays: number;
	lastStayDate?: string;
	notes?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface UpdateGuestRequest {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	documentType?: DocumentType;
	documentNumber?: string;
	occupation?: string;
	nationality?: string;
	address?: string;
	emergencyContactName?: string;
	emergencyContactPhone?: string;
	specialRequests?: string;
	notes?: string;
	isActive?: boolean;
}

export interface GuestResponse {
	id: string;
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
	documentType?: DocumentType;
	documentNumber: string;
	occupation?: string;
	nationality?: string;
	address?: string;
	emergencyContactName?: string;
	emergencyContactPhone?: string;
	specialRequests?: string;
	totalStays: number;
	lastStayDate?: string;
	notes?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export function guestToDatabase(
	guestData: CreateGuestRequest | UpdateGuestRequest,
): Record<string, unknown> {
	const dbData: Record<string, unknown> = {};

	if ("firstName" in guestData) dbData.first_name = guestData.firstName;
	if ("lastName" in guestData) dbData.last_name = guestData.lastName;
	if ("email" in guestData) dbData.email = guestData.email;
	if ("phone" in guestData) dbData.phone = guestData.phone;
	if ("documentType" in guestData)
		dbData.document_type = guestData.documentType;
	if ("documentNumber" in guestData)
		dbData.document_number = guestData.documentNumber;
	if ("occupation" in guestData) dbData.occupation = guestData.occupation;
	if ("nationality" in guestData) dbData.nationality = guestData.nationality;
	if ("address" in guestData) dbData.address = guestData.address;
	if ("emergencyContactName" in guestData)
		dbData.emergency_contact_name = guestData.emergencyContactName;
	if ("emergencyContactPhone" in guestData)
		dbData.emergency_contact_phone = guestData.emergencyContactPhone;
	if ("specialRequests" in guestData)
		dbData.special_requests = guestData.specialRequests;
	if ("notes" in guestData) dbData.notes = guestData.notes;
	if ("isActive" in guestData) dbData.is_active = guestData.isActive;

	return dbData;
}

export function guestToApi(guestData: Record<string, unknown>): GuestResponse {
	return {
		id: guestData.id as string,
		firstName: guestData.first_name as string,
		lastName: guestData.last_name as string,
		email: guestData.email as string | undefined,
		phone: guestData.phone as string | undefined,
		documentType: guestData.document_type as DocumentType | undefined,
		documentNumber: guestData.document_number as string,
		occupation: guestData.occupation as string | undefined,
		nationality: guestData.nationality as string | undefined,
		address: guestData.address as string | undefined,
		emergencyContactName: guestData.emergency_contact_name as
			| string
			| undefined,
		emergencyContactPhone: guestData.emergency_contact_phone as
			| string
			| undefined,
		specialRequests: guestData.special_requests as string | undefined,
		totalStays: (guestData.total_stays as number) || 0,
		lastStayDate: guestData.last_stay_date as string | undefined,
		notes: guestData.notes as string | undefined,
		isActive: guestData.is_active as boolean,
		createdAt: guestData.created_at as string,
		updatedAt: guestData.updated_at as string,
	};
}

export function guestsToApiArray(
	guestsData: Record<string, unknown>[],
): GuestResponse[] {
	return guestsData.map((guest) => guestToApi(guest));
}

export function createGuestToDatabase(
	guestData: CreateGuestRequest,
): Record<string, unknown> {
	return {
		first_name: guestData.firstName,
		last_name: guestData.lastName,
		email: guestData.email,
		phone: guestData.phone,
		document_type: guestData.documentType,
		document_number: guestData.documentNumber,
		occupation: guestData.occupation,
		nationality: guestData.nationality,
	};
}

export function updateGuestToDatabase(
	guestData: UpdateGuestRequest,
): Record<string, unknown> {
	const dbData: Record<string, unknown> = {};

	if (guestData.firstName !== undefined)
		dbData.first_name = guestData.firstName;
	if (guestData.lastName !== undefined) dbData.last_name = guestData.lastName;
	if (guestData.email !== undefined) dbData.email = guestData.email;
	if (guestData.phone !== undefined) dbData.phone = guestData.phone;
	if (guestData.documentType !== undefined)
		dbData.document_type = guestData.documentType;
	if (guestData.documentNumber !== undefined)
		dbData.document_number = guestData.documentNumber;
	if (guestData.occupation !== undefined)
		dbData.occupation = guestData.occupation;
	if (guestData.nationality !== undefined)
		dbData.nationality = guestData.nationality;
	if (guestData.address !== undefined) dbData.address = guestData.address;
	if (guestData.emergencyContactName !== undefined)
		dbData.emergency_contact_name = guestData.emergencyContactName;
	if (guestData.emergencyContactPhone !== undefined)
		dbData.emergency_contact_phone = guestData.emergencyContactPhone;
	if (guestData.specialRequests !== undefined)
		dbData.special_requests = guestData.specialRequests;
	if (guestData.notes !== undefined) dbData.notes = guestData.notes;
	if (guestData.isActive !== undefined) dbData.is_active = guestData.isActive;

	return dbData;
}
