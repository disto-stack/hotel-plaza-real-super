import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OccupationsDatesSelector } from "@/components/dashboard/occupations/OccupationsDatesSelector";
import { StayType } from "@/lib/types/occupation.types";

describe("OccupationsDatesSelector", () => {
	const defaultProps = {
		checkIn: "",
		onCheckInChange: vi.fn(),
		checkOut: "",
		onCheckOutChange: vi.fn(),
		stayType: StayType.NIGHTLY,
		onStayTypeChange: vi.fn(),
	};

	it("should render all fields", () => {
		render(<OccupationsDatesSelector {...defaultProps} />);

		expect(screen.getByLabelText("Check-in *")).toBeInTheDocument();
		expect(screen.getByLabelText("Check-out *")).toBeInTheDocument();
		expect(screen.getByLabelText("Tipo de estancia")).toBeInTheDocument();
		expect(screen.getByLabelText("Duración")).toBeInTheDocument();
	});

	it("should call onCheckInChange when check-in value changes", () => {
		const onCheckInChange = vi.fn();
		render(<OccupationsDatesSelector {...defaultProps} onCheckInChange={onCheckInChange} />);

		const checkInInput = screen.getByLabelText("Check-in *");
		fireEvent.change(checkInInput, { target: { value: "2026-06-19T23:00" } });

		expect(onCheckInChange).toHaveBeenCalledWith("2026-06-19T23:00");
	});

	it("should call onCheckOutChange when check-out value changes", () => {
		const onCheckOutChange = vi.fn();
		render(<OccupationsDatesSelector {...defaultProps} onCheckOutChange={onCheckOutChange} />);

		const checkOutInput = screen.getByLabelText("Check-out *");
		fireEvent.change(checkOutInput, { target: { value: "2026-06-22T23:00" } });

		expect(onCheckOutChange).toHaveBeenCalledWith("2026-06-22T23:00");
	});

	it("should call onStayTypeChange when stay type selection changes", () => {
		const onStayTypeChange = vi.fn();
		render(<OccupationsDatesSelector {...defaultProps} onStayTypeChange={onStayTypeChange} />);

		const stayTypeSelect = screen.getByLabelText("Tipo de estancia");
		fireEvent.change(stayTypeSelect, { target: { value: StayType.HOURLY } });

		expect(onStayTypeChange).toHaveBeenCalledWith(StayType.HOURLY);
	});

	it("should calculate and show nightly duration correctly", () => {
		render(
			<OccupationsDatesSelector
				{...defaultProps}
				checkIn="2026-06-19T23:00"
				checkOut="2026-06-22T23:00"
				stayType={StayType.NIGHTLY}
			/>,
		);

		const durationInput = screen.getByLabelText("Duración");
		expect(durationInput).toHaveValue("3 noches");
	});

	it("should calculate and show hourly duration correctly", () => {
		render(
			<OccupationsDatesSelector
				{...defaultProps}
				checkIn="2026-06-19T23:00"
				checkOut="2026-06-20T04:00"
				stayType={StayType.HOURLY}
			/>,
		);

		const durationInput = screen.getByLabelText("Duración");
		expect(durationInput).toHaveValue("5 horas");
	});

	it("should show 'Selecciona fechas' when dates are missing", () => {
		render(<OccupationsDatesSelector {...defaultProps} checkIn="" checkOut="" />);

		const durationInput = screen.getByLabelText("Duración");
		expect(durationInput).toHaveValue("Selecciona fechas");
	});

	it("should show 'Fechas inválidas' when check-out is before check-in", () => {
		render(
			<OccupationsDatesSelector
				{...defaultProps}
				checkIn="2026-06-22T23:00"
				checkOut="2026-06-19T23:00"
			/>,
		);

		const durationInput = screen.getByLabelText("Duración");
		expect(durationInput).toHaveValue("Fechas inválidas");
	});
});
