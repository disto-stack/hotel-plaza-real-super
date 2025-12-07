"use client";

import { Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const menuItems = [{ icon: Users, label: "Huéspedes", href: "/guests" }];

export default function SidebarNav() {
	const pathname = usePathname();

	return (
		<nav className="flex flex-col gap-2 w-full">
			{menuItems.map((item) => {
				const isActive = pathname === item.href;
				return (
					<Link key={item.href} href={item.href}>
						<Button
							type="button"
							variant={isActive ? "default" : "ghost"}
							className="rounded-2xl w-full text-sm flex items-center justify-start gap-3 font-sans"
						>
							<item.icon className="w-4 h-4" />
							{item.label}
						</Button>
					</Link>
				);
			})}
		</nav>
	);
}
