"use client";

import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Guest } from "@/lib/types/guest.types";
import { columns } from "./columns";

interface GuestsTableProps {
	guests: Guest[];
}
export default function GuestsTable({ guests }: GuestsTableProps) {
	const table = useReactTable({
		data: guests,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	return (
		<div className="rounded-2xl border border-border overflow-hidden">
			{guests.length > 0 && (
				<Table>
					<TableHeader className="py-4">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="border-b border-border bg-muted/30"
							>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="p-4">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows.length > 0 ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="border-b border-border last:border-b-0 cursor-pointer transition-colors hover:bg-muted/30"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="p-4">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No hay huéspedes.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
