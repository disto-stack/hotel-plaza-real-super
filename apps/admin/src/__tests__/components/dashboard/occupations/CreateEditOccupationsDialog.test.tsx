import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CreateEditOccupationsDialog from "@/components/dashboard/occupations/CreateEditOccupationsDialog";
import { useAvailableRooms } from "@/hooks/useAvailableRooms";

vi.mock("@/hooks/useAvailableRooms", () => ({
	useAvailableRooms: vi.fn(),
}));

vi.mock("@/components/shared/RoomSelector", () => ({
	RoomSelector: () => <div data-testid="mock-room-selector" />,
}));

vi.mock("@/components/dashboard/guests/GuestSelector", () => ({
	GuestSelector: () => <div data-testid="mock-guest-selector" />,
}));

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("CreateEditOccupationsDialog", () => {
	const mockSetOpen = vi.fn();

	it("should render the dialog when open", () => {
		vi.mocked(useAvailableRooms).mockReturnValue({
			data: [],
			isFetching: false,
		} as any);

		render(<CreateEditOccupationsDialog open={true} setOpen={mockSetOpen} />, {
			wrapper,
		});

		expect(screen.getByText("Crear ocupación")).toBeInTheDocument();

		expect(screen.queryByTestId("mock-room-selector")).not.toBeInTheDocument();
		expect(
			screen.getByText("Selecciona las fechas primero"),
		).toBeInTheDocument();

		const checkInInput = screen.getByLabelText("Check-in *");
		const checkOutInput = screen.getByLabelText("Check-out *");
		fireEvent.change(checkInInput, { target: { value: "2026-06-19T23:00" } });
		fireEvent.change(checkOutInput, { target: { value: "2026-06-22T23:00" } });

		expect(screen.getByTestId("mock-room-selector")).toBeInTheDocument();
	});

	it("should not render when closed", () => {
		render(<CreateEditOccupationsDialog open={false} setOpen={mockSetOpen} />, {
			wrapper,
		});

		expect(screen.queryByText("Crear ocupación")).not.toBeInTheDocument();
	});

	it("should pass rooms to RoomSelector", () => {
		const mockRooms = [{ id: "1", roomNumber: "101" }];
		vi.mocked(useAvailableRooms).mockReturnValue({
			data: mockRooms,
			isFetching: false,
		} as any);

		render(<CreateEditOccupationsDialog open={true} setOpen={mockSetOpen} />, {
			wrapper,
		});

		const checkInInput = screen.getByLabelText("Check-in *");
		const checkOutInput = screen.getByLabelText("Check-out *");
		fireEvent.change(checkInInput, { target: { value: "2026-06-19T23:00" } });
		fireEvent.change(checkOutInput, { target: { value: "2026-06-22T23:00" } });

		expect(screen.getByTestId("mock-room-selector")).toBeInTheDocument();
	});
});
