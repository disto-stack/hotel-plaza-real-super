"use client";
import dynamic from "next/dynamic";
import UserMenu from "./UserMenu";

const ThemeSwitcher = dynamic(() => import("./ThemeSwitcher"), { ssr: false });

export default function Header() {
	return (
		<header
			className="flex items-center justify-end gap-2 p-4 border-b border-border"
			data-testid="header"
		>
			<ThemeSwitcher />
			<UserMenu />
		</header>
	);
}
