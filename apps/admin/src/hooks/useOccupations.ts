import { useQuery } from "@tanstack/react-query";
import { occupationsApi } from "@/lib/api/occupations";
import { authStore } from "@/store/authStore";

export function useOccupations() {
	const { isAuthenticated } = authStore();

	return useQuery({
		queryKey: ["occupations"],
		queryFn: occupationsApi.getOccupations,
		staleTime: 1000 * 60 * 5,
		enabled: isAuthenticated,
	});
}
