"use client";

import { UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchableSearchBar } from "@/components/ui/SearchableSearchBar";
import { useDebounce } from "@/hooks/useDebounce";
import { useGuests } from "@/hooks/useGuests";
import type { GuestResponse } from "@/lib/types/guest.types";
import { GuestQuickAddForm } from "./GuestQuickAddForm";
import { SelectedGuestsList } from "./SelectedGuestsList";

export interface SelectedGuest {
	guestId: string;
	firstName: string;
	lastName: string;
	email?: string | null;
	phone?: string | null;
	documentType: string;
	documentNumber: string;
	isPrimary: boolean;
}

interface GuestSelectorProps {
	selectedGuests: SelectedGuest[];
	onChange: (guests: SelectedGuest[]) => void;
}

export function GuestSelector({
	selectedGuests,
	onChange,
}: GuestSelectorProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchPage, setSearchPage] = useState(1);
	const [showQuickAdd, setShowQuickAdd] = useState(false);

	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const { data: searchResults, isFetching: isSearching } = useGuests({
		page: searchPage,
		limit: 5,
		search: debouncedSearchQuery,
	});

	const [accumulatedResults, setAccumulatedResults] = useState<GuestResponse[]>(
		[],
	);
	const lastQueryRef = useRef("");

	useEffect(() => {
		if (debouncedSearchQuery.trim() === "") {
			setAccumulatedResults([]);
			lastQueryRef.current = "";
			return;
		}

		if (searchResults?.guests) {
			if (debouncedSearchQuery !== lastQueryRef.current) {
				setAccumulatedResults(searchResults.guests);
				lastQueryRef.current = debouncedSearchQuery;
				setSearchPage(1);
			} else {
				setAccumulatedResults((prev: GuestResponse[]) => {
					const newGuests = searchResults.guests.filter(
						(g) => !prev.some((existing) => existing.id === g.id),
					);
					return [...prev, ...newGuests];
				});
			}
		}
	}, [searchResults, debouncedSearchQuery]);

	const filteredGuests = accumulatedResults.filter((guest) => {
		return !selectedGuests.some((sg) => sg.guestId === guest.id);
	});

	const hasMore = searchResults
		? accumulatedResults.length < searchResults.totalCount
		: false;

	const handleLoadMore = () => {
		setSearchPage((p) => p + 1);
	};

	const handleSelectGuest = (guest: GuestResponse) => {
		const newGuest: SelectedGuest = {
			guestId: guest.id,
			firstName: guest.firstName,
			lastName: guest.lastName,
			email: guest.email,
			phone: guest.phone,
			documentType: guest.documentType,
			documentNumber: guest.documentNumber,
			isPrimary: selectedGuests.length === 0,
		};

		const updated = [...selectedGuests, newGuest];
		onChange(updated);
		setSearchQuery("");
		setSearchPage(1);
		setAccumulatedResults([]);
	};

	const handleQuickAddSubmit = (newGuest: SelectedGuest) => {
		onChange([...selectedGuests, newGuest]);
		setShowQuickAdd(false);
	};

	return (
		<fieldset
			className="space-y-4 border-none p-0 m-0"
			data-testid="guest-selector"
		>
			<legend className="text-sm font-semibold font-heading text-foreground w-full mb-1">
				Huéspedes <span className="text-destructive">*</span> (
				{selectedGuests.length})
			</legend>

			<div className="flex gap-2 relative">
				<SearchableSearchBar
					placeholder="Buscar huésped existente por nombre, documento o correo electrónico..."
					value={searchQuery}
					onChange={setSearchQuery}
					onSelect={handleSelectGuest}
					isLoading={isSearching}
					results={filteredGuests}
					renderItem={(guest: GuestResponse) => (
						<>
							<span className="font-semibold text-sm text-foreground">
								{guest.firstName} {guest.lastName}
							</span>
							<span className="text-xs text-muted-foreground">
								{guest.documentType} {guest.documentNumber}{" "}
								{guest.email ? ` • ${guest.email}` : ""}
							</span>
						</>
					)}
					noResultsText="No se encontraron huéspedes"
					onLoadMore={handleLoadMore}
					hasMore={hasMore}
					isLoadingMore={isSearching && searchPage > 1}
					getItemTestId={(guest) => `guest-result-${guest.id}`}
					data-testid="guest-search"
				/>

				<Button
					type="button"
					variant="outline"
					onClick={() => setShowQuickAdd(!showQuickAdd)}
					className="flex items-center gap-2"
					data-testid="quick-add-button"
				>
					<UserPlus className="w-4 h-4" />
					Agregar rápido
				</Button>
			</div>

			{showQuickAdd && (
				<GuestQuickAddForm
					onSubmit={handleQuickAddSubmit}
					onClose={() => setShowQuickAdd(false)}
					isPrimary={selectedGuests.length === 0}
				/>
			)}
			<SelectedGuestsList selectedGuests={selectedGuests} onChange={onChange} />
		</fieldset>
	);
}
