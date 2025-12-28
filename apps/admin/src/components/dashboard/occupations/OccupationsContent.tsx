"use client";

import { useOccupations } from "@/hooks/useOccupations";
import OccupationsDataTable from "./OccupationsDataTable";

export default function GuestsContent() {
	const { data: occupations } = useOccupations();

	return (
		<div data-testid="occupations-page">
			<header>
				<h1 className="text-3xl font-semibold font-heading">Ocupaciones</h1>
				<p className="text-sm text-muted-foreground font-sans pt-2">
					Aquí puedes ver todas las ocupaciones y reservas registradas en el
					sistema.
				</p>
			</header>
			{occupations && <OccupationsDataTable occupations={occupations} />}
		</div>
	);
}
