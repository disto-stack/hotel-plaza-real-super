import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OccupationsCard from "@/components/dashboard/occupations/OccupationsCard";
import { getRoomTypeLabel } from "@/lib/formatters";
import type { GuestResponse } from "@/lib/types/guest.types";
import {
	type Occupation,
	OccupationStatus,
	StayType,
} from "@/lib/types/occupation.types";
import { type Room, RoomType } from "@/lib/types/room.types";
import { formatDateTime } from "@/lib/utils";

describe("OccupationsCard", () => {
	const occupation: Occupation = {
		id: "occupation-id-1",
		checkInDatetime: "2024-01-01T00:00:00Z",
		checkOutDatetime: "2024-01-02T00:00:00Z",
		guests: [
			{
				id: "1",
				occupationId: "occupation-id-1",
				guestId: "guest-id-1",
				isPrimary: true,
				createdAt: "2024-01-01T00:00:00Z",
				guest: {
					id: "guest-id-1",
					firstName: "John",
					lastName: "Doe",
					email: "[EMAIL_ADDRESS]",
					phone: "123456789",
					createdAt: "2024-01-01T00:00:00Z",
					updatedAt: "2024-01-01T00:00:00Z",
				} as GuestResponse,
			},
			{
				id: "2",
				occupationId: "occupation-id-1",
				guestId: "guest-id-2",
				isPrimary: false,
				createdAt: "2024-01-01T00:00:00Z",
				guest: {
					id: "guest-id-2",
					firstName: "Juan",
					lastName: "Manuel",
					email: "[EMAIL_ADDRESS]",
					phone: "123456789",
					createdAt: "2024-01-01T00:00:00Z",
					updatedAt: "2024-01-01T00:00:00Z",
				} as GuestResponse,
			},
		],
		status: OccupationStatus.RESERVED,
		roomId: "room-id-1",
		stayType: StayType.NIGHTLY,
		numberOfGuests: 1,
		totalPrice: 100,
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
		room: {
			id: "room-id-1",
			roomNumber: "407",
			roomType: RoomType.DOUBLE,
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-01T00:00:00Z",
		} as Room,
	};

	it("should render the occupations card", () => {
		render(<OccupationsCard occupation={occupation} />);

		expect(screen.getByTestId("occupation-card-title")).toBeInTheDocument();
		expect(screen.getByTestId("occupation-card-room-type")).toBeInTheDocument();
		expect(screen.getByTestId("occupation-card-status")).toBeInTheDocument();
		expect(screen.getByTestId("occupation-card-guest")).toBeInTheDocument();
		expect(screen.getByTestId("occupation-card-check-in")).toBeInTheDocument();
		expect(screen.getByTestId("occupation-card-check-out")).toBeInTheDocument();
		expect(screen.getByTestId("occupation-card-footer")).toBeInTheDocument();
		expect(
			screen.getByTestId("occupation-card-total-price"),
		).toBeInTheDocument();
	});

	it("should display the correct room number", () => {
		render(<OccupationsCard occupation={occupation} />);

		expect(screen.getByTestId("occupation-card-title")).toHaveTextContent(
			"407",
		);
	});

	it("should display the correct room type", () => {
		render(<OccupationsCard occupation={occupation} />);

		expect(screen.getByTestId("occupation-card-room-type")).toHaveTextContent(
			getRoomTypeLabel(occupation.room?.roomType),
		);
	});

	it("should render the primary guest", () => {
		render(<OccupationsCard occupation={occupation} />);

		const guestCard = screen.getByTestId("occupation-card-guest");

		expect(guestCard).toHaveTextContent("John Doe");
		expect(guestCard).not.toHaveTextContent("Juan Manuel");
	});

	it("should display the correct check-in date", () => {
		render(<OccupationsCard occupation={occupation} />);

		expect(screen.getByTestId("occupation-card-check-in")).toHaveTextContent(
			formatDateTime(occupation.checkInDatetime),
		);
	});

	it("should display the correct check-out date", () => {
		render(<OccupationsCard occupation={occupation} />);

		expect(screen.getByTestId("occupation-card-check-out")).toHaveTextContent(
			formatDateTime(occupation.checkOutDatetime),
		);
	});
});
