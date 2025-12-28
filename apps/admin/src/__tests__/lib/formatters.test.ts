import { describe, expect, it } from "vitest";
import {
	getOccupationStatusBadge,
	getOccupationStatusLabel,
	getRoomTypeLabel,
	getStayTypeLabel,
} from "@/lib/formatters";
import { OccupationStatus, StayType } from "@/lib/types/occupation.types";
import { RoomType } from "@/lib/types/room.types";

describe("formatters", () => {
	describe("when get room type label", () => {
		it("should return the room type label", () => {
			const roomType = RoomType.SINGLE;
			const label = getRoomTypeLabel(roomType);
			expect(label).toBe("Individual");
		});

		it("should return empty string when room type is undefined", () => {
			const roomType = undefined;
			const label = getRoomTypeLabel(roomType);
			expect(label).toBe("");
		});
	});

	it("should get stay type label", () => {
		const stayType = StayType.NIGHTLY;
		const label = getStayTypeLabel(stayType);
		expect(label).toBe("Noche");
	});

	it("should get occupation status label", () => {
		const status = OccupationStatus.CANCELLED;
		const label = getOccupationStatusLabel(status);
		expect(label).toBe("Cancelado");
	});

	it("should get occupation status badge variant", () => {
		const status = OccupationStatus.CANCELLED;
		const badge = getOccupationStatusBadge(status);
		expect(badge).toBe("muted");
	});
});
