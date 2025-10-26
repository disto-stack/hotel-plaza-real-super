import type {
	CreateUserRequest,
	UpdateUserRequest,
	UserResponse,
	UserRole,
} from "../types/user.type.ts";

export function userToDatabase(
	userData: CreateUserRequest | UpdateUserRequest,
): Record<string, unknown> {
	const dbData: Record<string, unknown> = {};

	if ("email" in userData) dbData.email = userData.email;
	if ("firstName" in userData) dbData.first_name = userData.firstName;
	if ("lastName" in userData) dbData.last_name = userData.lastName;
	if ("role" in userData) dbData.role = userData.role;
	if ("isActive" in userData) dbData.is_active = userData.isActive;

	return dbData;
}

export function userToApi(userData: Record<string, unknown>): UserResponse {
	return {
		id: userData.id as string,
		email: userData.email as string,
		firstName: userData.first_name as string,
		lastName: userData.last_name as string,
		role: userData.role as UserRole,
		isActive: userData.is_active as boolean,
		lastLoginAt: userData.last_login_at as string | undefined,
		createdAt: userData.created_at as string,
		updatedAt: userData.updated_at as string,
	};
}

export function usersToApiArray(
	usersData: Record<string, unknown>[],
): UserResponse[] {
	return usersData.map((user) => userToApi(user));
}

export function createUserToDatabase(
	userData: CreateUserRequest,
): Record<string, unknown> {
	return {
		email: userData.email,
		first_name: userData.firstName,
		last_name: userData.lastName,
		role: userData.role,
	};
}

export function updateUserToDatabase(
	userData: UpdateUserRequest,
): Record<string, unknown> {
	const dbData: Record<string, unknown> = {};

	if (userData.email !== undefined) dbData.email = userData.email;
	if (userData.firstName !== undefined) dbData.first_name = userData.firstName;
	if (userData.lastName !== undefined) dbData.last_name = userData.lastName;
	if (userData.role !== undefined) dbData.role = userData.role;
	if (userData.isActive !== undefined) dbData.is_active = userData.isActive;

	return dbData;
}

export function authToApi(authData: Record<string, unknown>): UserResponse {
	return {
		id:
			((authData.user as Record<string, unknown>)?.id as string) ||
			(authData.id as string),
		email:
			((authData.user as Record<string, unknown>)?.email as string) ||
			(authData.email as string),
		firstName:
			((
				(authData.user as Record<string, unknown>)?.user_metadata as Record<
					string,
					unknown
				>
			)?.first_name as string) || (authData.first_name as string),
		lastName:
			((
				(authData.user as Record<string, unknown>)?.user_metadata as Record<
					string,
					unknown
				>
			)?.last_name as string) || (authData.last_name as string),
		role:
			((
				(authData.user as Record<string, unknown>)?.user_metadata as Record<
					string,
					unknown
				>
			)?.role as UserRole) || (authData.role as UserRole),
		isActive: true,
		lastLoginAt: (authData.user as Record<string, unknown>)?.last_sign_in_at as
			| string
			| undefined,
		createdAt:
			((authData.user as Record<string, unknown>)?.created_at as string) ||
			new Date().toISOString(),
		updatedAt:
			((authData.user as Record<string, unknown>)?.updated_at as string) ||
			new Date().toISOString(),
	};
}

export function userToAuthMetadata(
	userData: CreateUserRequest,
): Record<string, unknown> {
	return {
		first_name: userData.firstName,
		last_name: userData.lastName,
		role: userData.role,
	};
}
