// apps/admin/src/components/auth/CreateUserForm.tsx
"use client";

import { useId, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCreateUser } from "@/hooks/useUsers";

export default function CreateUserForm() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		role: "receptionist",
	});

	const createUserMutation = useCreateUser();
	const { user, signOut } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			console.log("Submitting form data:", formData);
			await createUserMutation.mutateAsync(formData);

			// Limpiar formulario después del éxito
			setFormData({
				email: "",
				password: "",
				firstName: "",
				lastName: "",
				role: "receptionist",
			});
		} catch {
			// El error se maneja automáticamente en el hook
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleLogout = async () => {
		console.log("🔒 Botón de logout presionado");
		try {
			await signOut();
		} catch (error) {
			console.error("❌ Error en logout:", error);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
			{/* Header con usuario y logout */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-900">
					Crear Nuevo Usuario
				</h2>
				<div className="flex items-center space-x-3">
					{user && (
						<div className="text-sm text-gray-600">
							<span className="font-medium">
								{user.first_name} {user.last_name}
							</span>
							<span className="text-gray-400 ml-2">({user.role})</span>
						</div>
					)}
					<button
						type="button"
						onClick={handleLogout}
						className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
					>
						Logout
					</button>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Email */}
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email
					</label>
					<input
						type="email"
						id={useId()}
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						placeholder="usuario@hotel.com"
						required
						disabled={createUserMutation.isPending}
					/>
				</div>

				{/* Contraseña */}
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Contraseña
					</label>
					<input
						type="password"
						id={useId()}
						name="password"
						value={formData.password}
						onChange={handleInputChange}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						placeholder="Mínimo 6 caracteres"
						required
						disabled={createUserMutation.isPending}
					/>
				</div>

				{/* Nombre */}
				<div>
					<label
						htmlFor="firstName"
						className="block text-sm font-medium text-gray-700"
					>
						Nombre
					</label>
					<input
						type="text"
						id={useId()}
						name="firstName"
						value={formData.firstName}
						onChange={handleInputChange}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						placeholder="Juan"
						required
						disabled={createUserMutation.isPending}
					/>
				</div>

				{/* Apellido */}
				<div>
					<label
						htmlFor="lastName"
						className="block text-sm font-medium text-gray-700"
					>
						Apellido
					</label>
					<input
						type="text"
						id={useId()}
						name="lastName"
						value={formData.lastName}
						onChange={handleInputChange}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						placeholder="Pérez"
						required
						disabled={createUserMutation.isPending}
					/>
				</div>

				{/* Rol */}
				<div>
					<label
						htmlFor="role"
						className="block text-sm font-medium text-gray-700"
					>
						Rol
					</label>
					<select
						id={useId()}
						name="role"
						value={formData.role}
						onChange={handleInputChange}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						disabled={createUserMutation.isPending}
					>
						<option value="admin">Administrador</option>
						<option value="receptionist">Recepcionista</option>
					</select>
				</div>

				{/* Botón de envío */}
				<div className="pt-4">
					<button
						type="submit"
						disabled={createUserMutation.isPending}
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{createUserMutation.isPending ? "Creando..." : "Crear Usuario"}
					</button>
				</div>

				{/* Mensajes de estado */}
				{createUserMutation.isSuccess && (
					<div className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-md">
						✅ Usuario creado exitosamente!
					</div>
				)}

				{createUserMutation.isError && (
					<div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
						❌ {createUserMutation.error?.message || "Error creando usuario"}
					</div>
				)}
			</form>
		</div>
	);
}
