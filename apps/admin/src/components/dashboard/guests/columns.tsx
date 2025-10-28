import type { ColumnDef } from "@tanstack/react-table";
import type { Guest } from "@/lib/api/guests";

export const columns: ColumnDef<Guest>[] = [
	{
		header: "Nombre",
		accessorKey: "first_name",
	},
	{
		header: "Apellido",
		accessorKey: "last_name",
	},
];
