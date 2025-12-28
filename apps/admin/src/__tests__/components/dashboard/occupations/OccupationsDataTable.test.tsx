import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OccupationsDataTable from "@/components/dashboard/occupations/OccupationsDataTable";
import {
	type Occupation,
	OccupationStatus,
	StayType,
} from "@/lib/types/occupation.types";

describe("OccupationDataTable", () => {
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
	];

	it("should render without crashing", () => {
		render(<OccupationsDataTable occupations={mockOccupations} />);
		expect(screen.getByRole("table")).toBeInTheDocument();
	});

	it("should render without crashing when there are no occupations", () => {
		render(
			<OccupationsDataTable occupations={null as unknown as Occupation[]} />,
		);
		expect(screen.getByRole("table")).toBeInTheDocument();
	});
});
