import { useId } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { GuestCreateFormData } from "@/lib/validations/guest.schema";

interface GuestFormProps {
	register: UseFormRegister<GuestCreateFormData>;
	errors: FieldErrors<GuestCreateFormData>;
}

export function GuestForm({ register, errors }: GuestFormProps) {
	const formIds = {
		firstName: useId(),
		lastName: useId(),
		phone: useId(),
		documentType: useId(),
		documentNumber: useId(),
		email: useId(),
		occupation: useId(),
	};

	return (
		<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<FormField
				label="Nombre"
				htmlFor={formIds.firstName}
				required
				error={errors.firstName?.message}
			>
				<Input
					id={formIds.firstName}
					{...register("firstName")}
					placeholder="Juan Manuel"
					data-testid="first-name-input"
				/>
			</FormField>

			<FormField
				label="Apellido"
				htmlFor={formIds.lastName}
				required
				error={errors.lastName?.message}
			>
				<Input
					id={formIds.lastName}
					{...register("lastName")}
					placeholder="Pérez"
					data-testid="last-name-input"
				/>
			</FormField>

			<FormField
				label="Teléfono"
				htmlFor={formIds.phone}
				required
				error={errors.phone?.message}
			>
				<Input
					id={formIds.phone}
					{...register("phone")}
					placeholder="3104951906"
					data-testid="phone-input"
				/>
			</FormField>

			<FormField
				label="Tipo de documento"
				htmlFor={formIds.documentType}
				required
				error={errors.documentType?.message}
			>
				<Select
					id={formIds.documentType}
					{...register("documentType")}
					data-testid="document-type-input"
				>
					<option value="National ID">Cédula de ciudadanía</option>
					<option value="Identity Card">Tarjeta de identidad</option>
					<option value="Passport">Pasaporte</option>
					<option value="Citizenship Card">Cédula de extranjería</option>
				</Select>
			</FormField>

			<FormField
				label="Número de documento"
				htmlFor={formIds.documentNumber}
				required
				error={errors.documentNumber?.message}
			>
				<Input
					id={formIds.documentNumber}
					{...register("documentNumber")}
					placeholder="00000000"
					data-testid="document-number-input"
				/>
			</FormField>

			<FormField
				label="Email"
				htmlFor={formIds.email}
				error={errors.email?.message}
			>
				<Input
					id={formIds.email}
					{...register("email")}
					placeholder="john@example.com"
					data-testid="email-input"
				/>
			</FormField>

			<FormField
				label="Ocupación"
				htmlFor={formIds.occupation}
				required
				error={errors.occupation?.message}
			>
				<Input
					id={formIds.occupation}
					{...register("occupation")}
					placeholder="Estudiante"
					data-testid="occupation-input"
				/>
			</FormField>
		</section>
	);
}
