import type { Occupation } from "@/lib/types/occupation.types";
import OccupationsCard from "./OccupationsCard";

interface OccupationsGridProps {
	occupations: Occupation[];
}
export default function OccupationsGrid({ occupations }: OccupationsGridProps) {
	return (
		<div
			data-testid="occupations-grid"
			className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
		>
			{occupations.map((occupation, index) => (
				<div data-testid={`occupation-card-${index}`} key={occupation.id}>
					<OccupationsCard occupation={occupation} />
				</div>
			))}
		</div>
	);
}
