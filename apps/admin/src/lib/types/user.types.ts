export interface CreateUserData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: string;
}

export interface User {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	role: string;
	created_at: string;
	updated_at: string;
}
