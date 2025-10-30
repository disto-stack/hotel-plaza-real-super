import type { ColumnDef } from "@tanstack/react-table";
import type { Guest } from "@/lib/api/guests";

export const columns: ColumnDef<Guest>[] = [
	{
		header: "Nombres",
		accessorKey: "firstName",
	},
	{
		header: "Apellidos",
		accessorKey: "lastName",
	},
	{
		header: "Ocupación",
		accessorKey: "occupation",
	},
	{
		header: "Teléfono",
		accessorKey: "phone",
	},
	{
		header: "Número de documento",
		accessorKey: "documentNumber",
	},
];
