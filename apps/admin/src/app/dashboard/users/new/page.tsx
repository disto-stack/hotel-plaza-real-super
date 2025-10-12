import CreateUserForm from "@/components/auth/CreateUserForm";

export default function NewUserPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="mb-6">
						<nav className="flex" aria-label="Breadcrumb">
							<ol className="flex items-center space-x-4">
								<li>
									<a
										href="/dashboard"
										className="text-gray-400 hover:text-gray-500"
									>
										Dashboard
									</a>
								</li>
								<li>
									<a
										href="/dashboard/users"
										className="text-gray-400 hover:text-gray-500"
									>
										Usuarios
									</a>
								</li>
								<li>
									<span className="text-gray-500">Nuevo Usuario</span>
								</li>
							</ol>
						</nav>
					</div>

					<CreateUserForm />
				</div>
			</div>
		</div>
	);
}
