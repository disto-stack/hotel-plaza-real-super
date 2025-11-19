"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/lib/error-handler";

export default function LoginForm() {
	const emailId = useId();
	const passwordId = useId();

	const { signIn } = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);

		try {
			await signIn(email, password);
			router.push("/guests");
		} catch (error) {
			toast.error(extractErrorMessage(error), {
				duration: 5000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			className="flex flex-col gap-10 shadow-lg p-7 rounded-2xl bg-card w-100"
			onSubmit={handleLogin}
		>
			<section className="flex flex-col items-center justify-center gap-4">
				<Image
					src="/images/logo.png"
					alt="Hotel Plaza Real Logo"
					width={250}
					height={250}
				/>

				<p className="text-sm font-sans text-muted-foreground">
					Ingresa a tu cuenta para continuar
				</p>
			</section>

			<section className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium" htmlFor={emailId}>
						Correo electrónico
					</label>
					<input
						id={emailId}
						name="email"
						className="form-input"
						type="email"
						placeholder="admin@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium" htmlFor={passwordId}>
						Contraseña
					</label>

					<input
						id={passwordId}
						name="password"
						className="form-input"
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
			</section>

			<button className="btn btn-primary" type="submit" disabled={isLoading}>
				{isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
			</button>
		</form>
	);
}
