import { ChevronDown, Loader2 } from "lucide-react";
import React from "react";
import { Button } from "./button";
import { SearchBar } from "./SearchBar";

interface SearchableSearchBarProps<T> {
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	onSelect: (item: T) => void;
	isLoading?: boolean;
	results: T[];
	renderItem: (item: T) => React.ReactNode;
	noResultsText?: string;
	onLoadMore?: () => void;
	hasMore?: boolean;
	isLoadingMore?: boolean;
	"data-testid"?: string;
	getItemTestId?: (item: T, index: number) => string;
}

export function SearchableSearchBar<T>({
	placeholder,
	value,
	onChange,
	onSelect,
	isLoading = false,
	results = [],
	renderItem,
	noResultsText = "No se encontraron resultados",
	onLoadMore,
	hasMore = false,
	isLoadingMore = false,
	"data-testid": dataTestId,
	getItemTestId,
}: SearchableSearchBarProps<T>) {
	const [showDropdown, setShowDropdown] = React.useState(false);
	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div
			className="relative flex-1"
			ref={containerRef}
			data-testid={dataTestId}
		>
			<SearchBar
				placeholder={placeholder}
				value={value}
				onChange={(e) => {
					onChange(e.target.value);
					setShowDropdown(true);
				}}
				onFocus={() => setShowDropdown(true)}
				data-testid={`${dataTestId}-input`}
			/>
			<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />

			{showDropdown && value.trim() !== "" && (
				<div
					className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-card border border-border rounded-xl shadow-lg z-50 p-1"
					data-testid={`${dataTestId}-results`}
				>
					{isLoading && results.length === 0 ? (
						<div className="px-4 py-3 text-sm text-muted-foreground text-center font-sans flex items-center justify-center gap-2">
							<Loader2 className="w-4 h-4 animate-spin text-primary" />
							<span>Buscando...</span>
						</div>
					) : results.length > 0 ? (
						<>
							{results.map((item, idx) => (
								<button
									// biome-ignore lint/suspicious/noArrayIndexKey: generic component key fallback
									key={idx}
									type="button"
									onClick={() => {
										onSelect(item);
										setShowDropdown(false);
									}}
									className="w-full text-left px-4 py-2 hover:bg-muted/50 rounded-lg transition-colors flex flex-col gap-0.5"
									data-testid={
										getItemTestId
											? getItemTestId(item, idx)
											: `${dataTestId}-result-${idx}`
									}
								>
									{renderItem(item)}
								</button>
							))}
							{hasMore && onLoadMore && (
								<div className="p-1 border-t border-border flex justify-center">
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={onLoadMore}
										disabled={isLoadingMore}
										className="w-full text-xs font-sans py-1.5 flex items-center justify-center gap-1.5"
										data-testid={`${dataTestId}-load-more`}
									>
										{isLoadingMore ? (
											<Loader2 className="w-3.5 h-3.5 animate-spin" />
										) : null}
										{isLoadingMore ? "Cargando más..." : "Cargar más"}
									</Button>
								</div>
							)}
						</>
					) : (
						<div className="px-4 py-3 text-sm text-muted-foreground text-center font-sans">
							{noResultsText}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
