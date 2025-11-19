import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { authStore } from "@/store/authStore";

const AUTH_ERROR_MESSAGES = {
	invalid_credentials: "Correo electrónico o contraseña incorrectos",
	email_not_confirmed: "Correo electrónico no confirmado",
	too_many_requests: "Demasiados intentos. Por favor, espera un momento.",
	unauthorized: "No tienes permisos para acceder a esta página",
	unknown_error: "Ocurrió un error inesperado",
};

export function useAuth() {
	const { setLoading, setUser, logout } = authStore();
	const supabase = createClient();
	const isInitialized = useRef(false);

	const fetchUserData = async (userId: string) => {
		if (!supabase) return;

		const { data: userData } = await supabase
			.from("users")
			.select("*")
			.eq("id", userId)
			.single();

		return userData;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect should only run once
	useEffect(() => {
		if (!supabase) return;
		if (isInitialized.current) return;

		isInitialized.current = true;
		setLoading(true);

		const checkSession = async () => {
			const getSession = await supabase.auth.getSession();

			if (getSession?.data?.session?.user) {
				const userData = await fetchUserData(getSession.data.session.user.id);
				setUser(userData);
			} else {
				setUser(null);
			}

			setLoading(false);
		};

		checkSession();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT") {
				return;
			}

			if (event === "SIGNED_IN" && session?.user) {
				const userData = await fetchUserData(session.user.id);
				setUser(userData);
			} else if (event === "SIGNED_OUT") {
				setUser(null);
			}

			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signOut = async () => {
		if (!supabase) return;
		setLoading(true);

		const { error } = await supabase.auth.signOut({
			scope: "local",
		});

		if (error) {
			setLoading(false);

			const errorCode = error.code as keyof typeof AUTH_ERROR_MESSAGES;

			const errorMessage =
				AUTH_ERROR_MESSAGES[errorCode] || AUTH_ERROR_MESSAGES.unknown_error;

			throw new Error(errorMessage);
		}

		logout();

		setLoading(false);

		if (typeof window !== "undefined") {
			window.location.href = "/login";
		}
	};

	const signIn = async (email: string, password: string) => {
		if (!supabase) return;
		setLoading(true);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setLoading(false);

			const errorCode = error.code as keyof typeof AUTH_ERROR_MESSAGES;

			const errorMessage =
				AUTH_ERROR_MESSAGES[errorCode] || AUTH_ERROR_MESSAGES.unknown_error;

			throw new Error(errorMessage);
		}

		setLoading(false);
	};

	return {
		signOut,
		signIn,
	};
}
