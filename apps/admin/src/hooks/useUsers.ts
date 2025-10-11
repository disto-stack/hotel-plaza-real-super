// apps/admin/src/hooks/useUsers.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";

export function useUsers() {
	return useQuery({
		queryKey: ["users"],
		queryFn: usersApi.getUsers,
	});
}

export function useCreateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: usersApi.createUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error: any) => {
			console.error("Error creating user:", error);
		},
	});
}
