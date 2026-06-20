import { useQuery } from "@tanstack/react-query";
import { roomsApi } from "@/lib/api/rooms";
import { authStore } from "@/store/authStore";

export function useRooms() {
	const { isAuthenticated } = authStore();

	return useQuery({
		queryKey: ["rooms"],
		queryFn: roomsApi.getRooms,
		staleTime: 1000 * 60 * 5,
		enabled: isAuthenticated,
	});
}
