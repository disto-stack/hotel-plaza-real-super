import api from "@/lib/axios";

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

export const guestsApi = {
	getGuests: async (): Promise<Guest[]> => {
		const response = await api.get("/get-guests");
		return response.data.data;
	},

	getGuest: async (id: string): Promise<Guest> => {
		const response = await api.get(`/get-guest/${id}`);
		return response.data;
	},

	createGuest: async (guestData: CreateGuestData): Promise<Guest> => {
		const response = await api.post("/create-guest", guestData);
		return response.data;
	},
};
