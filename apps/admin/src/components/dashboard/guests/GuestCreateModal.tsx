"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCreateGuest } from "@/hooks/useGuests";
import { extractErrorMessage } from "@/lib/error-handler";

interface GuestCreateModalProps {
	open: boolean;
	onClose: () => void;
}

export default function GuestCreateModal({
	open,
	onClose,
}: GuestCreateModalProps) {
	const { mutateAsync, isPending } = useCreateGuest();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [documentType, setDocumentType] = useState("National ID");
	const [documentNumber, setDocumentNumber] = useState("");
	const [occupation, setOccupation] = useState("");

	const firstNameId = useId();
	const lastNameId = useId();
	const phoneId = useId();
	const documentTypeId = useId();
	const documentNumberId = useId();
	const occupationId = useId();

	if (!open) return null;

	const reset = () => {
		setFirstName("");
		setLastName("");
		setPhone("");
		setDocumentType("National ID");
		setDocumentNumber("");
		setOccupation("");
	};

	const handleClose = () => {
		if (isPending) return;
		reset();
		onClose();
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

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
		<main className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl border border-border">
			<header className="flex items-center justify-between px-5 py-4 border-b border-border">
				<h2 className="text-lg font-semibold font-heading">Nuevo huésped</h2>
			</header>

			<form onSubmit={handleSubmit} className="p-5 space-y-4">
				<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<article className="flex flex-col gap-2">
						<label htmlFor="firstName" className="text-sm font-medium">
							Nombre
						</label>
						<input
							className="form-input"
							value={firstName}
							id={firstNameId}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="Juan"
						/>
					</article>
					<article className="flex flex-col gap-2">
						<label htmlFor={lastNameId} className="text-sm font-medium">
							Apellido
						</label>
						<input
							className="form-input"
							value={lastName}
							id={lastNameId}
							onChange={(e) => setLastName(e.target.value)}
							placeholder="Pérez"
						/>
					</article>

					<article className="flex flex-col gap-2">
						<label htmlFor={phoneId} className="text-sm font-medium">
							Teléfono
						</label>
						<input
							className="form-input"
							value={phone}
							id={phoneId}
							onChange={(e) => setPhone(e.target.value)}
							placeholder="999999999"
						/>
					</article>

					<article className="flex flex-col gap-2">
						<label htmlFor={documentTypeId} className="text-sm font-medium">
							Tipo de documento
						</label>
						<select
							className="form-input"
							value={documentType}
							id={documentTypeId}
							onChange={(e) => setDocumentType(e.target.value)}
						>
							<option value="Passport">Pasaporte</option>
							<option value="National ID">Cédula de ciudadanía</option>
							<option value="Identity Card">Tarjeta de identidad</option>
						</select>
					</article>
					<article className="flex flex-col gap-2">
						<label htmlFor={documentNumberId} className="text-sm font-medium">
							Número de documento
						</label>
						<input
							className="form-input"
							value={documentNumber}
							id={documentNumberId}
							onChange={(e) => setDocumentNumber(e.target.value)}
							placeholder="00000000"
						/>
					</article>

					<article className="flex flex-col gap-2">
						<label htmlFor={occupationId} className="text-sm font-medium">
							Ocupación
						</label>
						<input
							className="form-input"
							value={occupation}
							id={occupationId}
							onChange={(e) => setOccupation(e.target.value)}
							placeholder="Estudiante"
						/>
					</article>
				</section>

				<section className="flex justify-end gap-2 pt-2">
					<Button
						type="reset"
						variant="ghost"
						className="font-sans"
						onClick={handleClose}
						disabled={isPending}
					>
						Cancelar
					</Button>
					<Button type="submit" variant="default" disabled={isPending}>
						{isPending ? "Guardando..." : "Guardar"}
					</Button>
				</section>
			</form>
		</main>
	);
}
