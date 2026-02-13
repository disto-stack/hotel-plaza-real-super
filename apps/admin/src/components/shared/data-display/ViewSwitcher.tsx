import { GridIcon, ListIcon } from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ViewType = "list" | "grid";

interface ViewSwitcherProps {
	className?: string;
	value?: ViewType;
	defaultValue?: ViewType;
	onValueChange?: (value: ViewType) => void;
}

export default function ViewSwitcher({
	className,
	defaultValue = "list",
	onValueChange,
}: ViewSwitcherProps) {
	const [value, setValue] = useState<ViewType>(defaultValue);
	const handleValueChange = (newValue: string) => {
		if (!newValue) return;

		const typedValue = newValue as ViewType;

		setValue(typedValue);
		onValueChange?.(typedValue);
	};
	return (
		<ToggleGroup
			data-testid="view-switcher"
			className={className}
			type="single"
			value={value}
			onValueChange={handleValueChange}
			size="lg"
		>
			<ToggleGroupItem
				data-testid="view-switcher-list"
				value="list"
				aria-label="List view"
			>
				<ListIcon className="w-4 h-4" />
			</ToggleGroupItem>
			<ToggleGroupItem
				data-testid="view-switcher-grid"
				value="grid"
				aria-label="Grid view"
			>
				<GridIcon className="w-4 h-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
