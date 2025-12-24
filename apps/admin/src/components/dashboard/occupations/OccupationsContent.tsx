"use client";

import { useOccupations } from "@/hooks/useOccupations";

export default function GuestsContent() {
	const { data: occupations, isLoading, error } = useOccupations();

	return (
		<div data-testid="guests-page">
			<header>
				<h1 className="text-3xl font-semibold font-heading">Ocupaciones</h1>
				<p className="text-sm text-muted-foreground font-sans pt-2">
					Aquí puedes ver todas las ocupaciones registradas en el sistema.
				</p>
			</header>

			<section>
				{occupations?.map((occupation) => (
					<div key={occupation.id}>
						<h2>{occupation.id}</h2>
					</div>
				))}
			</section>
		</div>
	);
}
