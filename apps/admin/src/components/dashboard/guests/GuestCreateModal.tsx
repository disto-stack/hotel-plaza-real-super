"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { GuestForm } from "@/components/dashboard/guests/GuestForm";
import { Button } from "@/components/ui/button";
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
			email,
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
				occupation: occupation || "Particular",
				email: email || undefined,
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
					<GuestForm register={register} errors={errors} />

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
