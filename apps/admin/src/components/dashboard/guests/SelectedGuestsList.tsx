import { CheckSquare, Square, Star, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SelectedGuest } from "./GuestSelector";

interface SelectedGuestsListProps {
	selectedGuests: SelectedGuest[];
	onChange: (guests: SelectedGuest[]) => void;
}

export function SelectedGuestsList({
	selectedGuests,
	onChange,
}: SelectedGuestsListProps) {
	const onSetPrimary = (guestId: string) => {
		const updated = selectedGuests.map((guest) => ({
			...guest,
			isPrimary: guest.guestId === guestId,
		}));
		onChange(updated);
	};

	const onRemove = (guestId: string) => {
		const removedGuest = selectedGuests.find((g) => g.guestId === guestId);
		const remaining = selectedGuests.filter(
			(guest) => guest.guestId !== guestId,
		);

		if (removedGuest?.isPrimary && remaining.length > 0) {
			remaining[0].isPrimary = true;
		}

		onChange(remaining);
	};

	if (selectedGuests.length === 0) {
		return (
			<div
				className="border border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-card/10"
				data-testid="guests-empty-state"
			>
				<UserPlus
					className="w-8 h-8 text-muted-foreground/60"
					aria-hidden="true"
				/>
				<div className="space-y-1">
					<p className="text-sm font-semibold text-foreground">
						Aún no se han agregado huéspedes
					</p>
					<p className="text-xs text-muted-foreground font-sans">
						Busca huéspedes existentes o usa Agregar rápido
					</p>
				</div>
			</div>
		);
	}

	return (
		<ul className="space-y-2" aria-label="Lista de huéspedes seleccionados">
			{selectedGuests.map((guest) => (
				<li
					key={guest.guestId}
					className={cn(
						"border border-border rounded-xl p-4 flex items-center justify-between transition-all",
						guest.isPrimary ? "bg-card/70 border-primary/30" : "bg-card/30",
					)}
					data-testid={`selected-guest-row-${guest.guestId}`}
				>
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => onSetPrimary(guest.guestId)}
							className="focus:outline-none"
							aria-label={`Establecer a ${guest.firstName} ${guest.lastName} como huésped principal`}
							data-testid={`set-primary-checkbox-${guest.guestId}`}
						>
							{guest.isPrimary ? (
								<CheckSquare
									className="w-5 h-5 text-primary"
									aria-hidden="true"
								/>
							) : (
								<Square
									className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors"
									aria-hidden="true"
								/>
							)}
						</button>

						{guest.isPrimary ? (
							<div className="flex items-center gap-1.5 text-primary">
								<Star
									className="w-4 h-4 fill-primary text-primary"
									aria-hidden="true"
								/>
								<span className="text-xs font-semibold uppercase tracking-wider">
									Principal
								</span>
							</div>
						) : (
							<span className="text-xs text-muted-foreground font-medium uppercase tracking-wider pl-5">
								Huésped
							</span>
						)}

						<span
							className={cn(
								"text-sm font-sans text-foreground",
								guest.isPrimary ? "font-semibold" : "font-normal",
							)}
						>
							{guest.firstName} {guest.lastName}
						</span>
					</div>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => onRemove(guest.guestId)}
						className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-lg"
						aria-label={`Eliminar a ${guest.firstName} ${guest.lastName}`}
						data-testid={`remove-guest-${guest.guestId}`}
					>
						<Trash2 className="w-4 h-4 text-destructive" aria-hidden="true" />
					</Button>
				</li>
			))}
		</ul>
	);
}
