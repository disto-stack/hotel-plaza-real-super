import { useQuery } from "@tanstack/react-query";
import { roomsApi } from "@/lib/api/rooms";
import { authStore } from "@/store/authStore";

export function useAvailableRooms(checkIn?: string, checkOut?: string) {
	const { isAuthenticated } = authStore();

	return useQuery({
		queryKey: ["rooms", "available", checkIn, checkOut],
		queryFn: () =>
			roomsApi.getAvailableRooms({
				checkIn: checkIn as string,
				checkOut: checkOut as string,
			}),
		enabled: isAuthenticated && !!checkIn && !!checkOut,
		staleTime: 1000 * 60 * 2,
	});
}
