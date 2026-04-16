"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import ViewSwitcher from "@/components/shared/data-display/ViewSwitcher";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import { useOccupations } from "@/hooks/useOccupations";
import { occupancyStore } from "@/store/occupancyStore";
import CreateEditOccupationsDialog from "./CreateEditOccupationsDialog";
import OccupationsDataTable from "./OccupationsDataTable";
import OccupationsGrid from "./OccupationsGrid";

export default function OccupationsContent() {
	const { data: occupations } = useOccupations();
	const { view, setView } = occupancyStore();
	const [open, setOpen] = useState(false);

	const handleViewTypeChange = (value: "list" | "grid") => {
		setView(value);
	};

	return (
		<>
			<div data-testid="occupations-page">
				<header>
					<h1 className="text-3xl font-semibold font-heading">Ocupaciones</h1>
					<p className="text-sm text-muted-foreground font-sans pt-2">
						Aquí puedes ver todas las ocupaciones y reservas registradas en el
						sistema.
					</p>
				</header>

				<div className="flex flex-col gap-5 py-5">
					<section className="flex justify-between items-center gap-3">
						<SearchBar
							data-testid="occupations-search-bar"
							className="w-10/12 xl:w-11/12"
							placeholder="Buscar ocupación por número de habitación o nombre de huésped"
						/>

						<ViewSwitcher
							className="w-2/12 xl:w-1/12 justify-center"
							defaultValue={view}
							onValueChange={handleViewTypeChange}
						/>

						<Button onClick={() => setOpen(true)}>
							<PlusIcon className="h-4 w-4" /> Crear ocupación
						</Button>
					</section>

					{occupations && view === "list" && (
						<div data-testid="occupations-data-table-container">
							<OccupationsDataTable occupations={occupations} />
						</div>
					)}

					{occupations && view === "grid" && (
						<div data-testid="occupations-grid-container">
							<OccupationsGrid occupations={occupations} />
						</div>
					)}
				</div>
			</div>

			<CreateEditOccupationsDialog open={open} setOpen={setOpen} />
		</>
	);
}
