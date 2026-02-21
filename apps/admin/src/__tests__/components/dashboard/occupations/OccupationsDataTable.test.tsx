import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import OccupationsDataTable from "@/components/dashboard/occupations/OccupationsDataTable";
import type { GuestResponse } from "@/lib/types/guest.types";
import {
	type Occupation,
	OccupationStatus,
	StayType,
} from "@/lib/types/occupation.types";
import { type Room, RoomType } from "@/lib/types/room.types";

describe("OccupationsDataTable", () => {
	const mockOccupation: Occupation = {
		id: "occ-1",
		checkInDatetime: "2024-01-01T14:00:00Z",
		checkOutDatetime: "2024-01-05T11:00:00Z",
		status: OccupationStatus.CHECKED_IN,
		stayType: StayType.NIGHTLY,
		numberOfGuests: 1,
		totalPrice: 500000,
		roomId: "room-1",
		room: {
			id: "room-1",
			roomNumber: "101",
			roomType: RoomType.SINGLE,
			createdAt: "",
			updatedAt: "",
		} as Room,
		guests: [
			{
				id: "og-1",
				occupationId: "occ-1",
				guestId: "g-1",
				isPrimary: true,
				createdAt: "",
				guest: {
					id: "g-1",
					firstName: "John",
					lastName: "Doe",
					email: "john@example.com",
					phone: "123456789",
					documentNumber: "12345",
					createdAt: "",
					updatedAt: "",
				} as GuestResponse,
			},
		],
		createdAt: "",
		updatedAt: "",
	};

	it("should render correctly with data", () => {
		render(<OccupationsDataTable occupations={[mockOccupation]} />);
		expect(screen.getByRole("table")).toBeInTheDocument();
		expect(screen.getByText("101")).toBeInTheDocument();
		expect(screen.getByText("John Doe")).toBeInTheDocument();
	});

	it("should render without crashing when there are no occupations", () => {
		render(
			<OccupationsDataTable occupations={null as unknown as Occupation[]} />,
		);
		expect(screen.getByRole("table")).toBeInTheDocument();
		expect(screen.getByText("No hay datos.")).toBeInTheDocument();
	});

	it("should open the details drawer when a row is clicked (Interaction Test)", async () => {
		const user = userEvent.setup();
		render(<OccupationsDataTable occupations={[mockOccupation]} />);

		const cell = screen.getByText("101");
		await user.click(cell);

		expect(screen.getByText("Detalles de la ocupación")).toBeInTheDocument();
	});
});
