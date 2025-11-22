"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useCreateGuest } from "@/hooks/useGuests";
import { extractErrorMessage } from "@/lib/error-handler";
import {
	type GuestCreateFormData,
	guestCreateSchema,
} from "@/lib/validations/guest.schema";

interface GuestCreateModalProps {
	open: boolean;
	onClose: () => void;
}

export default function GuestCreateModal({
	open,
	onClose,
}: GuestCreateModalProps) {
	const { mutateAsync, isPending } = useCreateGuest();

	const firstNameId = useId();
	const lastNameId = useId();
	const phoneId = useId();
	const documentTypeId = useId();
	const documentNumberId = useId();
	const occupationId = useId();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<GuestCreateFormData>({
		resolver: zodResolver(guestCreateSchema),
		mode: "onBlur",
	});

	if (!open) return null;

	const handleClose = () => {
		if (isPending) return;

		reset();
		onClose();
	};

	const onSubmit = async (data: GuestCreateFormData) => {
		const {
			firstName,
			lastName,
			phone,
			documentType,
			documentNumber,
			occupation,
		} = data;

		if (!firstName || !lastName || !documentType || !documentNumber) {
			return;
		}

		try {
			await mutateAsync({
				firstName,
				lastName,
				phone,
				documentType,
				documentNumber,
				occupation,
			});

			toast.success("Huésped creado correctamente");

			handleClose();
		} catch (err) {
			const errorMessage = extractErrorMessage(err);
			toast.error(errorMessage);
		}
	};

	return (
		<main
			className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm"
			data-testid="guest-create-modal"
		>
			<div className="bg-card rounded-2xl shadow-md p-5">
				<header className="flex items-center justify-between px-5 py-4">
					<h2 className="text-lg font-semibold font-heading text-center">
						Nuevo huésped
					</h2>
				</header>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="p-5 space-y-4"
					data-testid="guest-create-form"
				>
					<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							label="Nombre"
							htmlFor={firstNameId}
							required
							error={errors.firstName?.message}
						>
							<Input
								id={firstNameId}
								{...register("firstName")}
								placeholder="Juan Manuel"
								data-testid="first-name-input"
							/>
						</FormField>

						<FormField
							label="Apellido"
							htmlFor={lastNameId}
							required
							error={errors.lastName?.message}
						>
							<Input
								id={lastNameId}
								{...register("lastName")}
								placeholder="Pérez"
								data-testid="last-name-input"
							/>
						</FormField>

						<FormField
							label="Teléfono"
							htmlFor={phoneId}
							required
							error={errors.phone?.message}
						>
							<Input
								id={phoneId}
								{...register("phone")}
								placeholder="3104951906"
								data-testid="phone-input"
							/>
						</FormField>

						<FormField
							label="Tipo de documento"
							htmlFor={documentTypeId}
							required
							error={errors.documentType?.message}
						>
							<Select
								id={documentTypeId}
								{...register("documentType")}
								data-testid="document-type-input"
							>
								<option value="National ID">Cédula de ciudadanía</option>
								<option value="Identity Card">Tarjeta de identidad</option>
								<option value="Passport">Pasaporte</option>
							</Select>
						</FormField>

						<FormField
							label="Número de documento"
							htmlFor={documentNumberId}
							required
							error={errors.documentNumber?.message}
						>
							<Input
								id={documentNumberId}
								{...register("documentNumber")}
								placeholder="00000000"
								data-testid="document-number-input"
							/>
						</FormField>

						<FormField
							label="Ocupación"
							htmlFor={occupationId}
							required
							error={errors.occupation?.message}
						>
							<Input
								id={occupationId}
								{...register("occupation")}
								placeholder="Estudiante"
								data-testid="occupation-input"
							/>
						</FormField>
					</section>

					<section className="flex justify-end gap-2 pt-2">
						<Button
							type="reset"
							variant="ghost"
							className="font-sans"
							onClick={handleClose}
							disabled={isPending}
							data-testid="cancel-button"
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							variant="default"
							disabled={isPending || !isValid}
							data-testid="submit-button"
						>
							{isPending ? "Guardando..." : "Guardar"}
						</Button>
					</section>
				</form>
			</div>
		</main>
	);
}
