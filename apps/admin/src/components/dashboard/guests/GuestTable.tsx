import { DataTable } from "@/components/shared/data-display/DataTable";
import type { GuestResponse } from "@/lib/types/guest.types";
import { columns } from "./columns";

interface GuestsTableProps {
	guests: GuestResponse[];
}
export default function GuestsTable({ guests }: GuestsTableProps) {
	if (!guests.length) {
		return <p>No hay huéspedes registrados.</p>;
	}
	return <DataTable columns={columns} data={guests} />;
}
