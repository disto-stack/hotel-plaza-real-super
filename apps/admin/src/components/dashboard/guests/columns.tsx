import type { ColumnDef } from "@tanstack/react-table";
import type { GuestResponse } from "@/lib/types/guest.types";

export const columns: ColumnDef<GuestResponse>[] = [
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
