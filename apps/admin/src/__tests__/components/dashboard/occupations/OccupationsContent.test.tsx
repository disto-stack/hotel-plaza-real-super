/** biome-ignore-all lint/suspicious/noExplicitAny: For testing purposes */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OccupationsContent from "@/components/dashboard/occupations/OccupationsContent";
import { useOccupations } from "@/hooks/useOccupations";
import {
	type Occupation,
	OccupationStatus,
	StayType,
} from "@/lib/types/occupation.types";

vi.mock("@/hooks/useOccupations", () => ({
	useOccupations: vi.fn(),
}));

describe("OccupationsContent", () => {
	const mockOccupations: Occupation[] = [
		{
			id: "1",
			roomId: "1",
			checkInDatetime: "2024-01-01T00:00:00Z",
			checkOutDatetime: "2024-01-02T00:00:00Z",
			stayType: StayType.NIGHTLY,
			numberOfGuests: 2,
			totalPrice: 100,
			basePrice: 100,
			discountAmount: 0,
			status: OccupationStatus.RESERVED,
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-02T00:00:00Z",
		},
		{
			id: "2",
			roomId: "2",
			checkInDatetime: "2024-01-03T00:00:00Z",
			checkOutDatetime: "2024-01-04T00:00:00Z",
			stayType: StayType.HOURLY,
			numberOfGuests: 2,
			totalPrice: 100,
			basePrice: 100,
			discountAmount: 0,
			status: OccupationStatus.CHECKED_IN,
			createdAt: "2024-01-03T00:00:00Z",
			updatedAt: "2024-01-04T00:00:00Z",
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useOccupations).mockReturnValue({
			data: mockOccupations,
			isLoading: false,
			error: null,
			isSuccess: true,
			isError: false,
			isPending: false,
			isRefetching: false,
			isFetching: false,
			isStale: false,
			isLoadingError: false,
			isRefetchError: false,
			isPlaceholderData: false,
		} as any);
	});

	it("should render without crashing", () => {
		render(<OccupationsContent />);
		expect(screen.getByTestId("occupations-page")).toBeInTheDocument();
	});

	it("should render the page header with title and description", () => {
		render(<OccupationsContent />);

		expect(
			screen.getByRole("heading", { name: /ocupaciones/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/aquí puedes ver todas las ocupaciones y reservas registradas en el sistema/i,
			),
		).toBeInTheDocument();
	});

	it("should render the search bar", () => {
		render(<OccupationsContent />);

		const searchInput = screen.getByTestId("occupations-search-bar");
		expect(searchInput).toBeInTheDocument();
		expect(searchInput).toHaveAttribute(
			"placeholder",
			"Buscar ocupación por número de habitación o nombre de huésped",
		);
	});

	it("should render the view switcher", () => {
		render(<OccupationsContent />);

		const viewSwitcher = screen.getByTestId("view-switcher");
		expect(viewSwitcher).toBeInTheDocument();
	});

	it("should render the occupations data table", () => {
		render(<OccupationsContent />);

		const dataTable = screen.getByTestId("occupations-data-table-container");
		expect(dataTable).toBeInTheDocument();
	});

	it("should switch to grid view", async () => {
		const user = userEvent.setup();

		render(<OccupationsContent />);

		expect(
			screen.getByTestId("occupations-data-table-container"),
		).toBeInTheDocument();
		expect(
			screen.queryByTestId("occupations-grid-container"),
		).not.toBeInTheDocument();

		const gridButton = screen.getByTestId("view-switcher-grid");
		await user.click(gridButton);

		expect(
			screen.queryByTestId("occupations-data-table-container"),
		).not.toBeInTheDocument();
		expect(
			screen.getByTestId("occupations-grid-container"),
		).toBeInTheDocument();
	});
});
