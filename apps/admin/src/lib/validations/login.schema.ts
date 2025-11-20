import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.email("El correo electrónico no es válido")
		.min(1, "El correo electrónico es requerido"),
	password: z
		.string()
		.min(1, "La contraseña es requerida")
		.min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
