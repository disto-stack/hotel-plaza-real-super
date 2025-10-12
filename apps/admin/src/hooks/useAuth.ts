import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { authStore } from "@/store/authStore";

export function useAuth() {
	const { user, isAuthenticated, isLoading, setUser, setLoading, logout } =
		authStore();
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
		});

		return () => subscription.unsubscribe();
	}, []);

	const signOut = async () => {
		if (!supabase) return;
		const { error } = await supabase.auth.signOut({
			scope: "local",
		});

		if (error) {
			return;
		}

		logout();

		if (typeof window !== "undefined") {
			window.location.href = "/login";
		}
	};

	return {
		user,
		isAuthenticated,
		isLoading,
		signOut,
	};
}
