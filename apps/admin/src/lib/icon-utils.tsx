import { Clock, Moon } from "lucide-react";
import { StayType } from "@/lib/types/occupation.types";

export const getStayTypeIcon = (stayType: StayType, size: number = 16) => {
	const iconPerStayType = {
		[StayType.NIGHTLY]: <Moon size={size} />,
		[StayType.HOURLY]: <Clock size={size} />,
	};

	return iconPerStayType[stayType];
};
