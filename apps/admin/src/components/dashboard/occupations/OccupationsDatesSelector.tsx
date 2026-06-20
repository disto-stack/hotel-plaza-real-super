import { useId } from "react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StayType } from "@/lib/types/occupation.types";
import { differenceInDays, differenceInHours } from "date-fns";

interface OccupationsDatesSelectorProps {
	checkIn: string;
	onCheckInChange: (value: string) => void;
	checkOut: string;
	onCheckOutChange: (value: string) => void;
	stayType: StayType;
	onStayTypeChange: (value: StayType) => void;
}

export function OccupationsDatesSelector({
	checkIn,
	onCheckInChange,
	checkOut,
	onCheckOutChange,
	stayType,
	onStayTypeChange,
}: OccupationsDatesSelectorProps) {
	const formIds = {
		checkIn: useId(),
		checkOut: useId(),
		stayType: useId(),
		duration: useId(),
	};

	const getDurationLabel = () => {
		if (!checkIn || !checkOut) return "Selecciona fechas";
		const start = new Date(checkIn);
		const end = new Date(checkOut);
		if (end <= start) return "Fechas inválidas";

		if (stayType === StayType.NIGHTLY) {
			const nights = differenceInDays(end, start);
			return `${nights} ${nights === 1 ? "noche" : "noches"}`;
		} else {
			const hours = differenceInHours(end, start);
			return `${hours} ${hours === 1 ? "hora" : "horas"}`;
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<FormField htmlFor={formIds.checkIn} label="Check-in *">
					<Input
						id={formIds.checkIn}
						type="datetime-local"
						value={checkIn}
						onChange={(e) => onCheckInChange(e.target.value)}
					/>
				</FormField>

				<FormField htmlFor={formIds.checkOut} label="Check-out *">
					<Input
						id={formIds.checkOut}
						type="datetime-local"
						value={checkOut}
						min={checkIn}
						onChange={(e) => onCheckOutChange(e.target.value)}
					/>
				</FormField>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<FormField htmlFor={formIds.stayType} label="Tipo de estancia">
					<Select
						id={formIds.stayType}
						value={stayType}
						onChange={(e) => onStayTypeChange(e.target.value as StayType)}
					>
						<option value={StayType.NIGHTLY}>Por noche</option>
						<option value={StayType.HOURLY}>Por horas</option>
					</Select>
				</FormField>

				<FormField htmlFor={formIds.duration} label="Duración">
					<Input
						id={formIds.duration}
						type="text"
						readOnly
						disabled
						value={getDurationLabel()}
						className="bg-muted/50 cursor-not-allowed"
					/>
				</FormField>
			</div>
		</div>
	);
}
