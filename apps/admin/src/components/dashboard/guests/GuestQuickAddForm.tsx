import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	type GuestCreateFormData,
	guestCreateSchema,
} from "@/lib/validations/guest.schema";
import { GuestForm } from "./GuestForm";
import type { SelectedGuest } from "./GuestSelector";

interface GuestQuickAddFormProps {
	onSubmit: (guest: SelectedGuest) => void;
	onClose: () => void;
	isPrimary: boolean;
}

export function GuestQuickAddForm({
	onSubmit,
	onClose,
	isPrimary,
}: GuestQuickAddFormProps) {
	const quickAddForm = useForm<GuestCreateFormData>({
		resolver: zodResolver(guestCreateSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			phone: "",
			documentType: "National ID",
			documentNumber: "",
			email: "",
			occupation: "Particular",
		},
		mode: "onBlur",
	});

	const handleSubmitForm = (data: GuestCreateFormData) => {
		const newGuest: SelectedGuest = {
			guestId: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email || null,
			phone: data.phone || null,
			documentType: data.documentType,
			documentNumber: data.documentNumber,
			isPrimary,
		};
		onSubmit(newGuest);
	};

	return (
		<form
			onSubmit={quickAddForm.handleSubmit(handleSubmitForm)}
			className="border border-primary/20 bg-card/40 rounded-xl p-5 relative space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
			data-testid="quick-add-form-container"
		>
			<button
				type="button"
				onClick={onClose}
				className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
				aria-label="Cerrar formulario de agregar rápido"
				data-testid="close-quick-add"
			>
				<X className="w-4 h-4" />
			</button>

			<h4 className="text-sm font-semibold font-heading text-foreground">
				Agregar huésped rápido
			</h4>

			<GuestForm
				register={quickAddForm.register}
				errors={quickAddForm.formState.errors}
			/>

			<div className="flex items-center justify-between pt-2">
				<Button
					type="submit"
					disabled={!quickAddForm.formState.isValid}
					className="bg-primary text-primary-foreground hover:bg-primary/90"
					data-testid="add-guest-submit"
				>
					+ Agregar huésped
				</Button>
				<p className="text-xs text-muted-foreground font-sans">
					Puedes completar el perfil completo más tarde en la sección de
					Huéspedes
				</p>
			</div>
		</form>
	);
}
