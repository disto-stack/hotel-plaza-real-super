import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RoomSelector } from "@/components/shared/RoomSelector";
import { type Room, RoomType } from "@/lib/types/room.types";

const mockRooms: Room[] = [
	{
		id: "1",
		roomNumber: "101",
		roomType: RoomType.SINGLE,
		floor: 1,
		capacity: 2,
		pricePerNight: 100,
		pricePerHour: 20,
		extraPersonChargePerNight: 10,
		amenities: ["WiFi", "TV", "Mini Bar", "AC"],
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "2",
		roomNumber: "201",
		roomType: RoomType.DOUBLE,
		floor: 2,
		capacity: 4,
		pricePerNight: 200,
		pricePerHour: 40,
		extraPersonChargePerNight: 20,
		amenities: ["WiFi", "TV"],
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "3",
		roomNumber: "301",
		roomType: RoomType.FAMILY,
		floor: 3,
		capacity: 6,
		pricePerNight: 300,
		pricePerHour: 60,
		extraPersonChargePerNight: 30,
		amenities: ["WiFi", "TV", "Kitchen"],
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
];

describe("RoomSelector", () => {
	it("renders all rooms initially", () => {
		render(<RoomSelector rooms={mockRooms} onChange={() => {}} />);

		expect(screen.getByText("Habitación 101")).toBeInTheDocument();
		expect(screen.getByText("Habitación 201")).toBeInTheDocument();
		expect(screen.getByText("Habitación 301")).toBeInTheDocument();
	});

	it("filters rooms by search query", async () => {
		const user = userEvent.setup();
		render(<RoomSelector rooms={mockRooms} onChange={() => {}} />);

		const searchInput = screen.getByPlaceholderText(/Buscar por número/i);
		await user.type(searchInput, "101");

		expect(screen.getByText("Habitación 101")).toBeInTheDocument();
		expect(screen.queryByText("Habitación 201")).not.toBeInTheDocument();
		expect(screen.queryByText("Habitación 301")).not.toBeInTheDocument();
	});

	it("filters rooms by room type", async () => {
		const user = userEvent.setup();
		render(<RoomSelector rooms={mockRooms} onChange={() => {}} />);

		const nav = screen.getByLabelText(/Filtros de tipo de habitación/i);
		const singleFilter = within(nav).getByText(/Sencilla/i);
		await user.click(singleFilter);

		expect(screen.getByText("Habitación 101")).toBeInTheDocument();
		expect(screen.queryByText("Habitación 201")).not.toBeInTheDocument();
		expect(screen.queryByText("Habitación 301")).not.toBeInTheDocument();
	});

	it("calls onChange when a room is clicked", async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();
		render(<RoomSelector rooms={mockRooms} onChange={handleChange} />);

		const roomCard = screen.getByText("Habitación 101").closest("button");
		// biome-ignore lint/style/noNonNullAssertion: for testing purposes
		await user.click(roomCard!);

		expect(handleChange).toHaveBeenCalledWith("1");
	});

	it("displays selection summary bar when a room is selected", () => {
		render(<RoomSelector rooms={mockRooms} value="1" onChange={() => {}} />);

		// biome-ignore lint/style/noNonNullAssertion: for testing purposes
		const summaryBar = screen.getByText(/Seleccionado:/i).parentElement!;
		const utils = within(summaryBar);

		expect(utils.getByText(/Habitación 101/i)).toBeInTheDocument();
		expect(utils.getByText(/Sencilla/i)).toBeInTheDocument();
		expect(utils.getByText(/\$100\/noche/i)).toBeInTheDocument();
	});

	it("shows empty state when no rooms match", async () => {
		const user = userEvent.setup();
		render(<RoomSelector rooms={mockRooms} onChange={() => {}} />);

		const searchInput = screen.getByPlaceholderText(/Buscar por número/i);
		await user.type(searchInput, "999");

		expect(
			screen.getByText("No se encontraron habitaciones."),
		).toBeInTheDocument();
	});

	it("displays amenities with limit labels", () => {
		render(<RoomSelector rooms={mockRooms} onChange={() => {}} />);

		// Find the card for Room 101
		const roomsList = screen.getByLabelText(/Habitaciones disponibles/i);
		// biome-ignore lint/style/noNonNullAssertion: for testing purposes
		const roomCard101 = within(roomsList)
			.getByText("Habitación 101")
			.closest("li")!;

		const utils = within(roomCard101);

		// Room 101 has 4 amenities, should show 3 + (+1)
		expect(utils.getByText("WiFi")).toBeInTheDocument();
		expect(utils.getByText("TV")).toBeInTheDocument();
		expect(utils.getByText("Mini Bar")).toBeInTheDocument();
		expect(utils.getByText("+1")).toBeInTheDocument();
		expect(utils.queryByText("AC")).not.toBeInTheDocument();
	});
});
