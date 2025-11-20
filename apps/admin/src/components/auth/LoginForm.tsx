"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/lib/error-handler";
import { FormField } from "../ui/FormField";
import { Input } from "../ui/Input";

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
			data-testid="login-form"
		>
			<section className="flex flex-col items-center justify-center gap-4">
				<div className="w-60 h-30 relative">
					<Image
						src="/images/logo.png"
						alt="Hotel Plaza Real Logo"
						fill
						sizes="500px"
						style={{ objectFit: "contain" }}
					/>
				</div>

				<p className="text-sm font-sans text-muted-foreground">
					Ingresa a tu cuenta para continuar
				</p>
			</section>

			<section className="flex flex-col gap-4">
				<FormField label="Correo electrónico" htmlFor={emailId} required>
					<Input
						id={emailId}
						name="email"
						type="email"
						placeholder="admin@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						data-testid="email-input"
					/>
				</FormField>

				<FormField label="Contraseña" htmlFor={passwordId} required>
					<Input
						id={passwordId}
						name="password"
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						data-testid="password-input"
					/>
				</FormField>
			</section>

			<button
				className="btn btn-primary"
				type="submit"
				disabled={isLoading}
				data-testid="submit-button"
			>
				{isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
			</button>
		</form>
	);
}
