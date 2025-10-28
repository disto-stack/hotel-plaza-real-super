"use client";

import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [{ icon: Users, label: "Huéspedes", href: "/guests" }];

export default function Sidebar() {
	const pathname = usePathname();
	return (
		<aside className="flex flex-col items-center gap-5 bg-card border-r border-border shadow-sm w-64 p-2">
			<section className="flex items-center justify-center border-b border-border gap-2 py-2">
				<Image
					src="/images/logo.png"
					alt="Hotel Plaza Real Logo"
					width={100}
					height={100}
				/>

				<div>
					<h1 className="text-base font-heading font-semibold text-foreground">
						Plaza Real
					</h1>
					<h2 className="text-xs font-sans text-muted-foreground">
						Panel de administración
					</h2>
				</div>
			</section>

			<nav className="flex flex-col gap-2 w-full">
				{menuItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link key={item.href} href={item.href}>
							<Button
								type="button"
								className={cn(
									"btn rounded-2xl w-full text-sm flex items-center justify-start gap-3 font-sans",
									isActive ? "btn-primary" : "btn-ghost",
								)}
							>
								<item.icon className="w-4 h-4" />
								{item.label}
							</Button>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
