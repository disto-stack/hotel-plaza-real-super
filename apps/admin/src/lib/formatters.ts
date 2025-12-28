import type { VariantProps } from "class-variance-authority";
import type { badgeVariants } from "@/components/ui/badge";
import { OccupationStatus, StayType } from "./types/occupation.types";
import { RoomType } from "./types/room.types";

const roomTypeLabels = {
	[RoomType.SINGLE]: "Individual",
	[RoomType.DOUBLE]: "Doble",
	[RoomType.FAMILY]: "Familiar",
};

const stayTypeLabels = {
	[StayType.HOURLY]: "Rato",
	[StayType.NIGHTLY]: "Noche",
};

const occupationStatusLabels = {
	[OccupationStatus.RESERVED]: "Reservado",
	[OccupationStatus.CHECKED_IN]: "Check-in",
	[OccupationStatus.CHECKED_OUT]: "Check-out",
	[OccupationStatus.CANCELLED]: "Cancelado",
};

const occupationsStatusBadges = {
	[OccupationStatus.RESERVED]: "default",
	[OccupationStatus.CHECKED_IN]: "secondary",
	[OccupationStatus.CHECKED_OUT]: "destructive",
	[OccupationStatus.CANCELLED]: "muted",
};

export function getRoomTypeLabel(roomType?: RoomType) {
	if (!roomType) {
		return "";
	}

	return roomTypeLabels[roomType];
}

export function getStayTypeLabel(stayType: StayType) {
	return stayTypeLabels[stayType];
}

export function getOccupationStatusLabel(occupationStatus: OccupationStatus) {
	return occupationStatusLabels[occupationStatus];
}

export function getOccupationStatusBadge(occupationStatus: OccupationStatus) {
	return occupationsStatusBadges[occupationStatus] as VariantProps<
		typeof badgeVariants
	>["variant"];
}
