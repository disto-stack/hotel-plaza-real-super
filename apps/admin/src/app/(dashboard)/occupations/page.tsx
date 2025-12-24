import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import OccupationsContent from "@/components/dashboard/occupations/OccupationsContent";
import { occupationsApiServer } from "@/lib/api/occupations.server";
import { createServerQueryClient } from "@/lib/query-server";

export default async function OccupationsPage() {
	const queryClient = createServerQueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["occupations"],
		queryFn: occupationsApiServer.getOccupations,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<OccupationsContent />
		</HydrationBoundary>
	);
}
