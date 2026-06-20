import { CalendarIcon, Loader2Icon } from "lucide-react";

interface RoomsAvailabilityPlaceholderProps {
	datesAreValid: boolean;
	isLoadingRooms: boolean;
}

export function RoomsAvailabilityPlaceholder({
	datesAreValid,
	isLoadingRooms,
}: RoomsAvailabilityPlaceholderProps) {
	if (!datesAreValid) {
		return (
			<div className="flex flex-col gap-4">
				<header className="flex flex-col gap-1">
					<h3 className="text-sm font-semibold">Seleccionar habitación *</h3>
					<p className="text-muted-foreground text-xs">
						Elige tus fechas arriba para ver las habitaciones disponibles
					</p>
				</header>
				<div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground border border-dashed rounded-xl">
					<CalendarIcon className="size-10 opacity-40 text-muted-foreground" />
					<div className="flex flex-col items-center gap-1">
						<span className="text-sm font-semibold text-foreground">Selecciona las fechas primero</span>
						<span className="text-xs text-center text-muted-foreground max-w-xs px-4">
							Elige un check-in y check-out válidos para ver qué habitaciones están libres.
						</span>
					</div>
				</div>
			</div>
		);
	}

	if (isLoadingRooms) {
		return (
			<div className="flex flex-col gap-4">
				<header className="flex flex-col gap-1">
					<h3 className="text-sm font-semibold">Seleccionar habitación *</h3>
					<p className="text-muted-foreground text-xs">
						Buscando habitaciones disponibles...
					</p>
				</header>
				<div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground border border-dashed rounded-xl">
					<Loader2Icon className="size-8 animate-spin text-primary opacity-80" />
					<span className="text-sm mt-2">Buscando habitaciones disponibles…</span>
				</div>
			</div>
		);
	}

	return null;
}
