import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CreateEditOccupationsDialog from "@/components/dashboard/occupations/CreateEditOccupationsDialog";
import { useRooms } from "@/hooks/useRooms";

vi.mock("@/hooks/useRooms", () => ({
	useRooms: vi.fn(),
}));

vi.mock("@/components/shared/RoomSelector", () => ({
	RoomSelector: () => <div data-testid="mock-room-selector" />,
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
		vi.mocked(useRooms).mockReturnValue({
			data: [],
			isLoading: false,
		} as any);

		render(<CreateEditOccupationsDialog open={true} setOpen={mockSetOpen} />, {
			wrapper,
		});

		expect(screen.getByText("Crear ocupación")).toBeInTheDocument();
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
		vi.mocked(useRooms).mockReturnValue({
			data: mockRooms,
			isLoading: false,
		} as any);

		render(<CreateEditOccupationsDialog open={true} setOpen={mockSetOpen} />, {
			wrapper,
		});

		expect(screen.getByTestId("mock-room-selector")).toBeInTheDocument();
	});
});
