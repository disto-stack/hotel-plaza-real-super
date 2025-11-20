"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/lib/error-handler";
import {
	type LoginFormData,
	loginSchema,
} from "@/lib/validations/login.schema";
import { Button } from "../ui/button";
import { FormField } from "../ui/FormField";
import { Input } from "../ui/Input";

export default function LoginForm() {
	const emailId = useId();
	const passwordId = useId();

	const { signIn } = useAuth();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur",
	});

	const onSubmit = async (data: LoginFormData) => {
		const { email, password } = data;

		try {
			await signIn(email, password);
			router.push("/guests");
		} catch (error) {
			toast.error(extractErrorMessage(error), {
				duration: 5000,
			});
		}
	};

	return (
		<form
			className="flex flex-col gap-10 shadow-lg p-7 rounded-2xl bg-card w-100"
			onSubmit={handleSubmit(onSubmit)}
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
				<FormField
					label="Correo electrónico"
					htmlFor={emailId}
					required
					error={errors.email?.message}
				>
					{/* TODO: Add field validation in frontend */}
					<Input
						id={emailId}
						type="email"
						placeholder="admin@example.com"
						{...register("email")}
						data-testid="email-input"
					/>
				</FormField>

				<FormField
					label="Contraseña"
					htmlFor={passwordId}
					required
					error={errors.password?.message}
				>
					<Input
						id={passwordId}
						type="password"
						placeholder="••••••••"
						{...register("password")}
						data-testid="password-input"
					/>
				</FormField>
			</section>

			<Button
				variant="default"
				type="submit"
				disabled={isSubmitting || !isValid}
				data-testid="submit-button"
			>
				{isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
			</Button>
		</form>
	);
}
