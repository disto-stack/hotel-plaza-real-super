import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OccupationsGrid from "@/components/dashboard/occupations/OccupationsGrid";
import {
	type Occupation,
	OccupationStatus,
	StayType,
} from "@/lib/types/occupation.types";

describe("OccupationsGrid", () => {
	const occupations: Occupation[] = [
		{
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
				},
			],
			status: OccupationStatus.RESERVED,
			roomId: "room-id-1",
			stayType: StayType.NIGHTLY,
			numberOfGuests: 1,
			totalPrice: 100,
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-01T00:00:00Z",
		},
		{
			id: "occupation-id-2",
			checkInDatetime: "2024-01-01T00:00:00Z",
			checkOutDatetime: "2024-01-02T00:00:00Z",
			guests: [
				{
					id: "1",
					occupationId: "occupation-id-1",
					guestId: "guest-id-1",
					isPrimary: true,
					createdAt: "2024-01-01T00:00:00Z",
				},
			],
			status: OccupationStatus.CHECKED_IN,
			roomId: "room-id-1",
			stayType: StayType.HOURLY,
			numberOfGuests: 1,
			totalPrice: 100,
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-01T00:00:00Z",
		},
		{
			id: "occupation-id-3",
			checkInDatetime: "2024-01-01T00:00:00Z",
			checkOutDatetime: "2024-01-02T00:00:00Z",
			guests: [
				{
					id: "1",
					occupationId: "occupation-id-1",
					guestId: "guest-id-1",
					isPrimary: true,
					createdAt: "2024-01-01T00:00:00Z",
				},
			],
			status: OccupationStatus.CHECKED_OUT,
			roomId: "room-id-1",
			stayType: StayType.HOURLY,
			numberOfGuests: 1,
			totalPrice: 100,
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-01T00:00:00Z",
		},
	];

	it("should render a grid of occupations", () => {
		render(<OccupationsGrid occupations={occupations} />);

		expect(screen.getByTestId("occupations-grid")).toBeInTheDocument();
	});

	it("should render the occupations card", () => {
		render(<OccupationsGrid occupations={occupations} />);

		expect(screen.getByTestId("occupation-card-0")).toBeInTheDocument();
		expect(screen.getByTestId("occupation-card-1")).toBeInTheDocument();
		expect(screen.getByTestId("occupation-card-2")).toBeInTheDocument();
	});
});
