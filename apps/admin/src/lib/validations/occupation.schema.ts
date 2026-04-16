import { z } from "zod";

export const createOccupationSchema = z.object({
	roomId: z.string().min(1, "La habitación es requerida"),
	guests: z
		.array(
			z.object({
				guestId: z.string().min(1, "El huésped es requerido"),
				isPrimary: z.boolean(),
			}),
		)
		.min(1, "Al menos un huésped es requerido")
		.refine((guests) => guests.some((guest) => guest.isPrimary), {
			message: "Debe haber un huésped principal",
			path: ["guests"],
		}),
	checkInDatetime: z.string().min(1, "La fecha de check-in es requerida"),
	checkOutDatetime: z.string().min(1, "La fecha de check-out es requerida"),
	numberOfGuests: z.number().min(1, "El número de huéspedes es requerido"),
	paymentMethod: z.string().min(1, "El método de pago es requerido"),
	status: z.string().min(1, "El estado es requerido"),
	totalPrice: z.number().min(1, "El precio total es requerido"),
});

export type CreateOccupationFormData = z.infer<typeof createOccupationSchema>;
