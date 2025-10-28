"use client";

import GuestsTable from "@/components/dashboard/guests/GuestTable";
import { useGuests } from "@/hooks/useGuests";

export default function GuestsPage() {
	const { data: guests, isLoading, error } = useGuests();

	return (
		<main className="flex-1 p-4">
			<h1 className="text-2xl font-bold">Huéspedes</h1>

			{isLoading && <div>Cargando...</div>}
			{error && <div>Error: {error.message}</div>}
			{guests && <GuestsTable guests={guests} />}
		</main>
	);
}
