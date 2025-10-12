import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";

export function useCreateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: usersApi.createUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error: Error) => {
			console.error("Error creating user:", error);
		},
	});
}
