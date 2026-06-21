import { useState } from "react";
import {
	GuestSelector,
	type SelectedGuest,
} from "@/components/dashboard/guests/GuestSelector";
import { RoomSelector } from "@/components/shared/RoomSelector";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAvailableRooms } from "@/hooks/useAvailableRooms";
import { StayType } from "@/lib/types/occupation.types";
import { OccupationsDatesSelector } from "./OccupationsDatesSelector";
import { RoomsAvailabilityPlaceholder } from "./RoomsAvailabilityPlaceholder";

interface CreateEditOccupationsDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export default function CreateEditOccupationsDialog({
	open,
	setOpen,
}: CreateEditOccupationsDialogProps) {
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [stayType, setStayType] = useState<StayType>(StayType.NIGHTLY);
	const [selectedRoomId, setSelectedRoomId] = useState("");
	const [selectedGuests, setSelectedGuests] = useState<SelectedGuest[]>([]);

	const { data: availableRooms, isFetching: isLoadingRooms } =
		useAvailableRooms(checkIn || undefined, checkOut || undefined);

	function handleCheckInChange(value: string) {
		setCheckIn(value);
		setSelectedRoomId("");
	}

	function handleCheckOutChange(value: string) {
		setCheckOut(value);
		setSelectedRoomId("");
	}

	const datesAreValid = !!checkIn && !!checkOut && checkOut > checkIn;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Crear ocupación</DialogTitle>
				</DialogHeader>

				<section className="flex flex-col gap-6 py-4">
					<OccupationsDatesSelector
						checkIn={checkIn}
						onCheckInChange={handleCheckInChange}
						checkOut={checkOut}
						onCheckOutChange={handleCheckOutChange}
						stayType={stayType}
						onStayTypeChange={setStayType}
					/>

					{!datesAreValid || isLoadingRooms ? (
						<RoomsAvailabilityPlaceholder
							datesAreValid={datesAreValid}
							isLoadingRooms={isLoadingRooms}
						/>
					) : (
						<RoomSelector
							rooms={availableRooms ?? []}
							value={selectedRoomId}
							onChange={setSelectedRoomId}
						/>
					)}

					<hr className="border-border" />

					<GuestSelector
						selectedGuests={selectedGuests}
						onChange={setSelectedGuests}
					/>
				</section>
			</DialogContent>
		</Dialog>
	);
}
