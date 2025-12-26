"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useModeAnimation } from "react-theme-switch-animation";
import { Button } from "@/components/ui/button";

export default function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);

	const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation();

	const handleThemeToggle = () => {
		toggleSwitchTheme();
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			ref={ref}
			className="rounded-full"
			data-testid="theme-toggle-button"
			onClick={handleThemeToggle}
		>
			{isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
		</Button>
	);
}
