import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RoomsAvailabilityPlaceholder } from "@/components/dashboard/occupations/RoomsAvailabilityPlaceholder";

describe("RoomsAvailabilityPlaceholder", () => {
	it("should render date selection placeholder when dates are invalid", () => {
		render(
			<RoomsAvailabilityPlaceholder
				datesAreValid={false}
				isLoadingRooms={false}
			/>,
		);

		expect(screen.getByText("Seleccionar habitación *")).toBeInTheDocument();
		expect(
			screen.getByText("Elige tus fechas arriba para ver las habitaciones disponibles"),
		).toBeInTheDocument();
		expect(screen.getByText("Selecciona las fechas primero")).toBeInTheDocument();
		expect(
			screen.getByText(
				"Elige un check-in y check-out válidos para ver qué habitaciones están libres.",
			),
		).toBeInTheDocument();
	});

	it("should render loading placeholder when loading rooms", () => {
		render(
			<RoomsAvailabilityPlaceholder
				datesAreValid={true}
				isLoadingRooms={true}
			/>,
		);

		expect(screen.getByText("Seleccionar habitación *")).toBeInTheDocument();
		expect(screen.getByText("Buscando habitaciones disponibles...")).toBeInTheDocument();
		expect(screen.getByText("Buscando habitaciones disponibles…")).toBeInTheDocument();
	});

	it("should render null when dates are valid and not loading", () => {
		const { container } = render(
			<RoomsAvailabilityPlaceholder
				datesAreValid={true}
				isLoadingRooms={false}
			/>,
		);

		expect(container.firstChild).toBeNull();
	});
});
