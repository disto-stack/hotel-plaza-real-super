export type UserRole = "admin" | "receptionist";

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: UserRole;
	isActive: boolean;
	lastLoginAt?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateUserRequest {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: UserRole;
}

export interface UpdateUserRequest {
	email?: string;
	firstName?: string;
	lastName?: string;
	role?: UserRole;
	isActive?: boolean;
}

export interface UserResponse {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: UserRole;
	isActive: boolean;
	lastLoginAt?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateUserResponse {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: UserRole;
	createdAt: string;
}
