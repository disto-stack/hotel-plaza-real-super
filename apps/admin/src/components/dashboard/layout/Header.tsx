import { Moon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";

Moon;
export default function Header() {
	return (
		<header className="flex items-center justify-end gap-2 p-4 border-b border-border">
			<Button variant="ghost" size="icon" className="rounded-full">
				<Moon className="w-4 h-4" />
			</Button>
			<UserMenu />
		</header>
	);
}
