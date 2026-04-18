import { useId, useState } from "react";
import { RoomSelector } from "@/components/shared/RoomSelector";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useRooms } from "@/hooks/useRooms";

interface CreateEditOccupationsDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}
export default function CreateEditOccupationsDialog({
	open,
	setOpen,
}: CreateEditOccupationsDialogProps) {
	const formIds = {
		roomId: useId(),
	};

	const { data: rooms } = useRooms();

	const [selectedRoomId, setSelectedRoomId] = useState("");

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Crear ocupación</DialogTitle>
				</DialogHeader>

				<section className="py-4">
					<RoomSelector
						rooms={rooms ?? []}
						value={selectedRoomId}
						onChange={setSelectedRoomId}
					/>
				</section>
			</DialogContent>
		</Dialog>
	);
}
