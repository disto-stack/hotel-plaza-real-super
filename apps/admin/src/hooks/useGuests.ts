import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { guestsApi } from "@/lib/api/guests";

export function useGuests() {
	return useQuery({
		queryKey: ["guests"],
		queryFn: guestsApi.getGuests,
		staleTime: 1000 * 60 * 5,
	});
}

export function useGuest(id: string) {
	return useQuery({
		queryKey: ["guest", id],
		queryFn: () => guestsApi.getGuest(id),
		enabled: !!id,
	});
}

export function useCreateGuest() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: guestsApi.createGuest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["guests"] });
		},
	});
}
