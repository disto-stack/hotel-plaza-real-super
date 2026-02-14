import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return (
			<div
				data-testid="data-table-column-header-without-sorting"
				className={cn(className)}
			>
				{title}
			</div>
		);
	}

	return (
		<div
			data-testid="data-table-column-header-with-sorting"
			className={cn("flex items-center space-x-2", className)}
		>
			<Button
				data-testid="sort-button"
				variant="ghost"
				size="sm"
				className={cn(
					"-ml-3 h-8 data-[state=open]:bg-accent",
					column.getIsSorted() && "text-primary font-bold",
				)}
				onClick={() => {
					if (column.getIsSorted() === "desc") {
						column.clearSorting();
						return;
					}

					column.toggleSorting(column.getIsSorted() === "asc");
				}}
			>
				<span>{title}</span>
				{column.getIsSorted() === "desc" ? (
					<ArrowDown
						data-testid="sort-button-down"
						aria-label="Sort descending"
						className="ml-2 h-4 w-4"
					/>
				) : column.getIsSorted() === "asc" ? (
					<ArrowUp
						data-testid="sort-button-up"
						aria-label="Sort ascending"
						className="ml-2 h-4 w-4"
					/>
				) : (
					<ArrowUpDown
						data-testid="sort-button-up-down"
						aria-label="Sort"
						className="ml-2 h-4 w-4"
					/>
				)}
			</Button>
		</div>
	);
}
