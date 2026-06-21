import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { guestsApi } from "@/lib/api/guests";
import { authStore } from "@/store/authStore";

export function useGuests(params?: {
	page?: number;
	limit?: number;
	search?: string;
}) {
	const { isAuthenticated } = authStore();

	return useQuery({
		queryKey: ["guests", params],
		queryFn: ({ signal }) => guestsApi.getGuests(params, { signal }),
		staleTime: 1000 * 60 * 5,
		enabled: isAuthenticated,
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
