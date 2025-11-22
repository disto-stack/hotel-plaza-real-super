import { z } from "zod";

export const guestCreateSchema = z.object({
	firstName: z.string().min(1, "El nombre es requerido"),
	lastName: z.string().min(1, "El apellido es requerido"),
	phone: z.string().min(1, "El teléfono de contacto es requerido"),
	documentType: z.enum([
		"Passport",
		"National ID",
		"Identity Card",
		"Citizenship Card",
	]),
	documentNumber: z.string().min(1, "El número de documento es requerido"),
	occupation: z.string().min(1, "La ocupación es requerida"),
});

export type GuestCreateFormData = z.infer<typeof guestCreateSchema>;
