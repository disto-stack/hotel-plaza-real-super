"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	sorting?: SortingState;
	onSortingChange?: React.Dispatch<React.SetStateAction<SortingState>>;
	onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	sorting,
	onSortingChange,
	onRowClick,
}: DataTableProps<TData, TValue>) {
	const [internalSorting, setInternalSorting] = React.useState<SortingState>(
		[],
	);

	const finalSorting = sorting ?? internalSorting;
	const finalSetSorting = onSortingChange ?? setInternalSorting;

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: finalSetSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting: finalSorting,
		},
	});

	return (
		<div
			data-testid="data-table"
			className="rounded-2xl border border-border overflow-hidden"
		>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow
							key={headerGroup.id}
							className="border-b border-border bg-muted/30"
						>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										className="py-5 px-4 font-bold font-heading"
										data-testid={`data-table-header-${header.id}`}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-testid={`data-table-row-${row.id}`}
								data-state={row.getIsSelected() && "selected"}
								className="border-b border-border last:border-b-0 cursor-pointer transition-colors hover:bg-muted/30"
								onClick={() => onRowClick?.(row.original)}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className="py-5 px-4">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No hay datos.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
