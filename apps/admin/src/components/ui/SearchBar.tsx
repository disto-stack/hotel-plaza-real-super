import { SearchIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./Input";

export interface SearchBarProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
	({ className, ...props }, ref) => {
		return (
			<div className={cn("relative", className)}>
				<SearchIcon
					className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
					data-testid="search-bar-icon"
				/>
				<Input
					type="text"
					ref={ref}
					className="pl-8 w-full"
					data-testid="search-bar-input"
					{...props}
				/>
			</div>
		);
	},
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
