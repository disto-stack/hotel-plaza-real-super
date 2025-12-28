import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns/format";
import { es } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDateTime(dateTime: string) {
	return format(dateTime, "EEEE, MMMM dd, yyyy, hh:mm a", { locale: es });
}
