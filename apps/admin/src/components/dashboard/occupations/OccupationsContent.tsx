"use client";

import ViewSwitcher from "@/components/shared/data-display/ViewSwitcher";
import { SearchBar } from "@/components/ui/SearchBar";
import { useOccupations } from "@/hooks/useOccupations";
import { occupancyStore } from "@/store/occupancyStore";
import OccupationsDataTable from "./OccupationsDataTable";

export default function OccupationsContent() {
	const { data: occupations } = useOccupations();
	const { view, setView } = occupancyStore();

	const handleViewTypeChange = (value: "list" | "grid") => {
		setView(value);
	};

	return (
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
				</section>

				{occupations && view === "list" && (
					<div data-testid="occupations-data-table-container">
						<OccupationsDataTable
							data-testid="occupations-data-table"
							occupations={occupations}
						/>
					</div>
				)}

				{occupations && view === "grid" && (
					<div data-testid="occupations-grid">Grid</div>
				)}
			</div>
		</div>
	);
}
