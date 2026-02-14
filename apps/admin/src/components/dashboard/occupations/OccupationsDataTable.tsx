import type { SortingState } from "@tanstack/react-table";
import React from "react";
import { DataTable } from "@/components/shared/data-display/DataTable";
import type { Occupation } from "@/lib/types/occupation.types";
import { occupationsTableColumns } from "./occupationsTableColumns";

interface OccupationsDatatableProps {
	occupations: Occupation[];
}
export default function OccupationsDataTable({
	occupations,
}: OccupationsDatatableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);

	return (
		<DataTable
			columns={occupationsTableColumns}
			data={occupations || []}
			sorting={sorting}
			onSortingChange={setSorting}
		/>
	);
}
