"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import GuestCreateModal from "@/components/dashboard/guests/GuestCreateModal";
import GuestsTable from "@/components/dashboard/guests/GuestTable";
import { Button } from "@/components/ui/button";
import { useGuests } from "@/hooks/useGuests";

export default function GuestsPage() {
	const { data: guests, isLoading, error } = useGuests();
	const [openCreate, setOpenCreate] = useState(false);

	return (
		<main className="flex-1 p-4">
			<header>
				<h1 className="text-3xl font-semibold font-heading">Huéspedes</h1>
				<p className="text-sm text-muted-foreground font-sans pt-2">
					Aquí puedes ver todos los huéspedes registrados en el sistema.
				</p>
			</header>

			<section>
				<div className="flex justify-end py-2">
					<Button
						className="btn btn-primary rounded-xl"
						onClick={() => setOpenCreate(true)}
					>
						<Plus className="w-4 h-4" />
						Agregar huésped
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
		</main>
	);
}
