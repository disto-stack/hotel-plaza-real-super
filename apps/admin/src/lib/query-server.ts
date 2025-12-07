import { QueryClient } from "@tanstack/react-query";
import { guestsApiServer } from "@/lib/api/guests.server";

export async function prefetchGuests() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5,
				retry: 3,
				refetchOnWindowFocus: false,
			},
		},
	});

	await queryClient.prefetchQuery({
		queryKey: ["guests"],
		queryFn: guestsApiServer.getGuests,
	});

	return queryClient;
}
