import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "@/components/shared/data-display/DataTable";
import type { Occupation } from "@/lib/types/occupation.types";
import { OccupationsDrawer } from "./OccupationsDrawer";
import { occupationsTableColumns } from "./occupationsTableColumns";

interface OccupationsDatatableProps {
	occupations: Occupation[];
}
export default function OccupationsDataTable({
	occupations,
}: OccupationsDatatableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [selectedOccupation, setSelectedOccupation] =
		useState<Occupation | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const handleRowClick = (occupation: Occupation) => {
		setSelectedOccupation(occupation);
		setIsDrawerOpen(true);
	};

	return (
		<>
			<DataTable
				columns={occupationsTableColumns}
				data={occupations || []}
				sorting={sorting}
				onSortingChange={setSorting}
				onRowClick={handleRowClick}
			/>

			{selectedOccupation && (
				<OccupationsDrawer
					occupation={selectedOccupation}
					open={isDrawerOpen}
					setOpen={setIsDrawerOpen}
				/>
			)}
		</>
	);
}
