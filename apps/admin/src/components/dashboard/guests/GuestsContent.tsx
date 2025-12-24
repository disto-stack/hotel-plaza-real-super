"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import GuestCreateModal from "@/components/dashboard/guests/GuestCreateModal";
import GuestsTable from "@/components/dashboard/guests/GuestTable";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import { useGuests } from "@/hooks/useGuests";

export default function GuestsContent() {
	const { data: guests, isLoading, error } = useGuests();
	const [openCreate, setOpenCreate] = useState(false);

	return (
		<div data-testid="guests-page">
			<header>
				<h1 className="text-3xl font-semibold font-heading">Huéspedes</h1>
				<p className="text-sm text-muted-foreground font-sans pt-2">
					Aquí puedes ver todos los huéspedes registrados en el sistema.
				</p>
			</header>

			<section>
				<div className="flex justify-between py-2 gap-3">
					<SearchBar
						className="w-10/12 xl:w-11/12"
						placeholder="Buscar huésped por nombre, apellido o número de documento"
					/>

					<Button
						className="w-2/12 xl:w-1/12"
						variant="default"
						onClick={() => setOpenCreate(true)}
					>
						<Plus className="w-4 h-4" />
						Agregar
					</Button>
				</div>

				{isLoading && (
					<div className="text-sm text-muted-foreground font-sans">
						Cargando...
					</div>
				)}
				{error && (
					<div className="text-sm text-destructive font-sans">
						No se pudieron cargar los huéspedes. Por favor, intente nuevamente.
					</div>
				)}
				{guests && <GuestsTable guests={guests} />}
			</section>
			<GuestCreateModal
				open={openCreate}
				onClose={() => setOpenCreate(false)}
			/>
		</div>
	);
}
