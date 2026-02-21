import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OccupationsDrawer } from "@/components/dashboard/occupations/OccupationsDrawer";
import {
	type Occupation,
	OccupationStatus,
	StayType,
} from "@/lib/types/occupation.types";
import { type Room, RoomType } from "@/lib/types/room.types";

vi.mock("@/lib/formatters", () => ({
	getOccupationStatusBadge: vi.fn().mockReturnValue("default"),
	getOccupationStatusLabel: vi.fn().mockReturnValue("Reservado"),
	getStayTypeLabel: vi.fn().mockReturnValue("Noche"),
}));

vi.mock("@/lib/icon-utils", () => ({
	getStayTypeIcon: vi
		.fn()
		.mockReturnValue(<span data-testid="stay-type-icon" />),
}));

vi.mock("@/lib/utils", () => ({
	formatDateTime: vi.fn().mockImplementation((date) => date),
	cn: vi.fn().mockImplementation((...classes) => classes.join(" ")),
}));

vi.mock("./OccupationsGuestsCollapsible", () => ({
	OccupationsGuestsCollapsible: () => <div data-testid="guests-collapsible" />,
}));

describe("OccupationsDrawer", () => {
	const mockOccupation: Occupation = {
		id: "1",
		roomId: "room-1",
		checkInDatetime: "2024-01-01T14:00:00Z",
		checkOutDatetime: "2024-01-02T11:00:00Z",
		stayType: StayType.NIGHTLY,
		numberOfGuests: 2,
		totalPrice: 100,
		status: OccupationStatus.RESERVED,
		createdAt: "2024-01-01T10:00:00Z",
		updatedAt: "2024-01-01T10:00:00Z",
		room: {
			id: "room-1",
			roomNumber: "101",
			roomType: RoomType.SINGLE,
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-01T00:00:00Z",
		} as Room,
		guests: [],
	};

	const mockSetOpen = vi.fn();

	it("should render the drawer with occupation details when open", () => {
		render(
			<OccupationsDrawer
				occupation={mockOccupation}
				open={true}
				setOpen={mockSetOpen}
			/>,
		);

		expect(screen.getByText("Detalles de la ocupación")).toBeInTheDocument();
		expect(screen.getByText("Habitación 101")).toBeInTheDocument();
		expect(screen.getByTestId("stay-type-icon")).toBeInTheDocument();
		expect(screen.getByText("Reservado")).toBeInTheDocument();
		expect(screen.getByText("Check-in")).toBeInTheDocument();
		expect(screen.getByText("Check-out")).toBeInTheDocument();
	});

	it("should not be visible when open is false", () => {
		render(
			<OccupationsDrawer
				occupation={mockOccupation}
				open={false}
				setOpen={mockSetOpen}
			/>,
		);

		expect(
			screen.queryByText("Detalles de la ocupación"),
		).not.toBeInTheDocument();
	});

	it("should call setOpen(false) when close button is clicked", () => {
		render(
			<OccupationsDrawer
				occupation={mockOccupation}
				open={true}
				setOpen={mockSetOpen}
			/>,
		);

		const closeButton = screen.getByText("Cerrar");
		fireEvent.click(closeButton);

		expect(mockSetOpen).toHaveBeenCalledWith(false);
	});
});
