import type { ColumnDef, Row } from "@tanstack/react-table";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";
import {
	getOccupationStatusBadge,
	getOccupationStatusLabel,
	getRoomTypeLabel,
	getStayTypeLabel,
} from "@/lib/formatters";
import type { Occupation } from "@/lib/types/occupation.types";
import { formatDateTime } from "@/lib/utils";

export const sortOccupationsByRoom = (
	occupationA: Occupation,
	occupationB: Occupation,
) => {
	return (occupationA.room?.roomNumber || "").localeCompare(
		occupationB.room?.roomNumber || "",
	);
};

export const sortOccupationsByGuests = (
	occupationA: Occupation,
	occupationB: Occupation,
) => {
	const primaryGuestA = occupationA.guests
		?.filter((occupationGuest) => occupationGuest.isPrimary)
		.at(0);
	const primaryGuestB = occupationB.guests
		?.filter((occupationGuest) => occupationGuest.isPrimary)
		.at(0);

	if (!primaryGuestA?.guest?.firstName || !primaryGuestB?.guest?.firstName) {
		return 0;
	}

	const fullNameA = `${primaryGuestA.guest.firstName} ${primaryGuestA.guest.lastName}`;
	const fullNameB = `${primaryGuestB.guest.firstName} ${primaryGuestB.guest.lastName}`;

	return fullNameA.localeCompare(fullNameB);
};

export const sortOccupationsByCheckIn = (
	occupationA: Occupation,
	occupationB: Occupation,
) => {
	return sortByDate(occupationA.checkInDatetime, occupationB.checkInDatetime);
};

export const sortOccupationsByCheckOut = (
	occupationA: Occupation,
	occupationB: Occupation,
) => {
	return sortByDate(occupationA.checkOutDatetime, occupationB.checkOutDatetime);
};

export const sortOccupationsByStatus = (
	occupationA: Occupation,
	occupationB: Occupation,
) => {
	return occupationA.status.localeCompare(occupationB.status);
};

export const sortOccupationsByPrice = (
	occupationA: Occupation,
	occupationB: Occupation,
) => {
	return occupationA.totalPrice - occupationB.totalPrice;
};

const sortByDate = (dateA: string, dateB: string) => {
	const dateAValue = new Date(dateA);
	const dateBValue = new Date(dateB);

	const diff = dateAValue.getTime() - dateBValue.getTime();

	if (diff === 0) {
		return 0;
	}

	return diff > 0 ? 1 : -1;
};

export const occupationsTableColumns: ColumnDef<Occupation>[] = [
	{
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Habitación" />;
		},
		accessorKey: "room.roomNumber",
		cell: ({ row }) => {
			return (
				<div className="flex flex-col gap-1 font-sans">
					<span className="font-medium">{row.original.room?.roomNumber}</span>
					<span className="text-xs text-muted-foreground">
						{getRoomTypeLabel(row.original.room?.roomType)}
					</span>
				</div>
			);
		},
		sortingFn: (rowA, rowB) =>
			sortOccupationsByRoom(rowA.original, rowB.original),
	},
	{
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Huéspedes" />;
		},
		accessorKey: "guests",
		cell: ({ row }) => {
			return (
				<React.Fragment key={row.original.id}>
					{row.original.guests
						?.filter((occupationGuest) => occupationGuest.isPrimary)
						.map((occupationGuest) => (
							<div
								key={occupationGuest.id}
								className="flex flex-col gap-1 font-sans"
							>
								<span className="font-medium">
									{occupationGuest.guest?.firstName}{" "}
									{occupationGuest.guest?.lastName}
								</span>
								<span className="text-xs text-muted-foreground">
									{row.original.numberOfGuests}{" "}
									{row.original.numberOfGuests > 1 ? "huéspedes" : "huésped"}
								</span>
							</div>
						))}
				</React.Fragment>
			);
		},
		sortingFn: (rowA, rowB) =>
			sortOccupationsByGuests(rowA.original, rowB.original),
	},
	{
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Check-in" />;
		},
		accessorKey: "checkInDatetime",
		cell: ({ row }) => {
			return <span>{formatDateTime(row.original.checkInDatetime)}</span>;
		},
		sortingFn: (rowA, rowB) =>
			sortOccupationsByCheckIn(rowA.original, rowB.original),
	},
	{
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Check-out" />;
		},
		accessorKey: "checkOutDatetime",
		cell: ({ row }) => {
			return <span>{formatDateTime(row.original.checkOutDatetime)}</span>;
		},
		sortingFn: (rowA, rowB) =>
			sortOccupationsByCheckOut(rowA.original, rowB.original),
	},
	{
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Estado" />;
		},
		accessorKey: "status",
		cell: ({ row }) => {
			return (
				<Badge variant={getOccupationStatusBadge(row.original.status)}>
					{getOccupationStatusLabel(row.original.status)}
				</Badge>
			);
		},
		sortingFn: (rowA, rowB) =>
			sortOccupationsByStatus(rowA.original, rowB.original),
	},
	{
		header: "Tipo",
		accessorKey: "stayType",
		cell: ({ row }) => {
			return <span>{getStayTypeLabel(row.original.stayType)}</span>;
		},
	},
	{
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Precio total" />;
		},
		accessorKey: "totalPrice",
		cell: ({ row }) => {
			return (
				<span className="font-medium text-primary font-mono">
					{row.original.totalPrice.toLocaleString("es-CO", {
						style: "currency",
						currency: "COP",
					})}
				</span>
			);
		},
		sortingFn: (rowA, rowB) =>
			sortOccupationsByPrice(rowA.original, rowB.original),
	},
];
