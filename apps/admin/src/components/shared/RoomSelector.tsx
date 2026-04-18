import { Check, UsersIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SearchBar } from "@/components/ui/SearchBar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Room } from "@/lib/types/room.types";
import { RoomType } from "@/lib/types/room.types";
import { cn } from "@/lib/utils";

interface RoomSelectorProps {
	rooms: Room[];
	value?: string;
	onChange: (roomId: string) => void;
}

// TODO: Use a more semantic color and set theme for the family room type
const ROOM_TYPE_STYLES: Record<
	RoomType,
	{ badge: string; selected: string; idle: string }
> = {
	[RoomType.SINGLE]: {
		badge: "bg-gray-100 text-gray-800",
		selected: "border-gray-300 shadow-sm bg-gray-50/15",
		idle: "border-border hover:border-gray-200 hover:bg-gray-50/15",
	},
	[RoomType.DOUBLE]: {
		badge: "bg-blue-100 text-blue-800",
		selected: "border-blue-300 shadow-sm bg-blue-50/15",
		idle: "border-border hover:border-blue-200 hover:bg-blue-50/15",
	},
	[RoomType.FAMILY]: {
		badge: "bg-accent/40 text-primary font-bold",
		selected: "border-primary shadow-sm bg-primary/15",
		idle: "border-primary/10 hover:border-primary bg-primary/5 hover:bg-primary/15",
	},
};

export function RoomSelector({ rooms, value, onChange }: RoomSelectorProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [filterType, setFilterType] = useState<RoomType | "ALL">("ALL");

	const filteredRooms = useMemo(() => {
		let result = rooms;

		if (filterType !== "ALL") {
			result = result.filter((room) => room.roomType === filterType);
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(room) =>
					room.roomNumber.toLowerCase().includes(query) ||
					room.floor.toString().includes(query) ||
					room.roomType.toLowerCase().includes(query),
			);
		}

		return result;
	}, [rooms, searchQuery, filterType]);

	const displayRooms = filteredRooms;

	const roomTypeLabels: Record<RoomType, string> = {
		[RoomType.SINGLE]: "Sencilla",
		[RoomType.DOUBLE]: "Doble",
		[RoomType.FAMILY]: "Familiar",
	};

	return (
		<section
			className="flex flex-col gap-4"
			aria-labelledby="room-selector-title"
		>
			<header className="flex flex-col gap-1">
				<h3 className="text-sm font-semibold">Seleccionar habitación *</h3>
				<p className="text-muted-foreground text-xs">
					Elige entre {rooms.length} habitaciones disponibles
				</p>
			</header>

			<search className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div className="flex-1 w-full relative">
					<SearchBar
						placeholder="Buscar por número, tipo o piso..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full"
					/>
				</div>
				<nav aria-label="Filtros de tipo de habitación" className="flex">
					<ToggleGroup
						type="single"
						value={filterType}
						onValueChange={(val) => {
							if (val) setFilterType(val as RoomType | "ALL");
						}}
						size="sm"
					>
						<ToggleGroupItem value="ALL">Todas</ToggleGroupItem>
						{Object.values(RoomType).map((type) => (
							<ToggleGroupItem key={type} value={type} className="capitalize">
								{roomTypeLabels[type]}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</nav>
			</search>

			<div
				className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 max-h-[400px] overflow-y-auto pr-2 pb-2"
				aria-label="Habitaciones disponibles"
				role="listbox"
			>
				{displayRooms.map((room) => {
					const isSelected = value === room.id;
					const styles = ROOM_TYPE_STYLES[room.roomType];

					const badgeClass = cn("border-transparent", styles.badge);
					const cardStyle = isSelected ? styles.selected : styles.idle;

					return (
						<div key={room.id} className="h-full list-none" role="presentation">
							<button
								type="button"
								role="option"
								aria-selected={isSelected}
								onClick={() => onChange(room.id)}
								className={cn(
									"group relative flex flex-col rounded-xl text-left h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200",
									isSelected && "ring-2 ring-primary/20",
								)}
							>
								{isSelected && (
									<div className="absolute top-2.5 right-2 bg-primary text-white rounded-full size-6 flex items-center justify-center p-1 shadow-sm z-20">
										<Check className="size-3.5 stroke-[3.5px]" />
									</div>
								)}
								<Card
									className={cn(
										"h-full flex flex-col w-full transition-colors",
										cardStyle,
									)}
								>
									<CardHeader className="flex flex-row justify-between items-start space-y-0 pb-4">
										<div className="flex flex-col gap-1">
											<CardTitle className="text-lg">
												Habitación {room.roomNumber}
											</CardTitle>
											<CardDescription className="text-sm">
												Piso {room.floor}
											</CardDescription>
										</div>
										<Badge className={badgeClass}>
											<span className="capitalize">
												{roomTypeLabels[room.roomType]}
											</span>
										</Badge>
									</CardHeader>

									<CardContent className="flex flex-col gap-2 pb-4">
										<div className="flex items-center gap-2 text-muted-foreground text-sm">
											<UsersIcon className="size-4" aria-hidden="true" />
											<span>Hasta {room.capacity} huéspedes</span>
										</div>
										<div className="font-bold">
											$ {room.pricePerNight}
											<span className="text-sm font-normal text-muted-foreground">
												/noche
											</span>
										</div>
									</CardContent>

									<CardFooter className="mt-auto pt-4 border-t border-border/50">
										<ul
											className="flex gap-2 flex-wrap w-full"
											aria-label="Comodidades"
										>
											{room.amenities?.slice(0, 3).map((amenity) => (
												<li
													key={amenity}
													className="px-2 py-1 bg-secondary/50 text-xs rounded-md text-muted-foreground"
												>
													{amenity}
												</li>
											))}
											{room.amenities?.length > 3 && (
												<li className="px-2 py-1 bg-secondary/50 text-xs rounded-md text-muted-foreground">
													+{room.amenities.length - 3}
												</li>
											)}
										</ul>
									</CardFooter>
								</Card>
							</button>
						</div>
					);
				})}
			</div>
			{displayRooms.length === 0 && (
				<p className="text-center py-8 text-muted-foreground text-sm">
					No se encontraron habitaciones.
				</p>
			)}

			{value && (
				<div className="mt-2 p-3 border border-border rounded-xl flex items-center gap-2 text-sm transition-all animate-in fade-in slide-in-from-bottom-2">
					<span className="font-bold text-foreground">Seleccionado:</span>
					{(() => {
						const selectedRoom = rooms.find((room) => room.id === value);
						if (!selectedRoom) return null;

						return (
							<span className="text-muted-foreground">
								Habitación {selectedRoom.roomNumber} -{" "}
								{roomTypeLabels[selectedRoom.roomType]} ($
								{selectedRoom.pricePerNight}
								/noche)
							</span>
						);
					})()}
				</div>
			)}
		</section>
	);
}
