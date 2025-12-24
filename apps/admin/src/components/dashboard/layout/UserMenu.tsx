"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/lib/error-handler";
import { authStore } from "@/store/authStore";

export default function UserMenu() {
	const { user } = authStore();
	const { signOut } = useAuth();
	const router = useRouter();

	const handleSignOut = async () => {
		try {
			await signOut();
			router.push("/login");
		} catch (error) {
			toast.error(extractErrorMessage(error));
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full"
					data-testid="user-menu-trigger"
				>
					<User className="w-4 h-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-white">
				<DropdownMenuLabel>
					<span className="block">
						{user?.first_name} {user?.last_name}
					</span>
					<span className="text-xs text-gray-500">{user?.email}</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="transition-colors duration-75"
					onClick={handleSignOut}
					data-testid="sign-out-button"
				>
					<LogOut className="w-4 h-4" />
					<span className="text-sm font-medium text-destructive">
						Cerrar sesión
					</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
