import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import GuestsContent from "@/components/dashboard/guests/GuestsContent";
import { prefetchGuests } from "@/lib/query-server";

export default async function GuestsPage() {
	const queryClient = await prefetchGuests();

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<GuestsContent />
		</HydrationBoundary>
	);
}
