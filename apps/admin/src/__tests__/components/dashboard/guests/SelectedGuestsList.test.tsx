import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SelectedGuest } from "@/components/dashboard/guests/GuestSelector";
import { SelectedGuestsList } from "@/components/dashboard/guests/SelectedGuestsList";

describe("SelectedGuestsList", () => {
	const mockOnChange = vi.fn();

	const mockGuests: SelectedGuest[] = [
		{
			guestId: "101",
			firstName: "John",
			lastName: "Doe",
			email: "john@example.com",
			phone: "12345",
			documentType: "National ID",
			documentNumber: "12345678",
			isPrimary: true,
		},
		{
			guestId: "102",
			firstName: "Jane",
			lastName: "Smith",
			email: "jane@example.com",
			phone: "67890",
			documentType: "Passport",
			documentNumber: "P-88888",
			isPrimary: false,
		},
	];

	it("should render empty state when no guests are provided", () => {
		render(<SelectedGuestsList selectedGuests={[]} onChange={mockOnChange} />);

		expect(screen.getByTestId("guests-empty-state")).toBeInTheDocument();
		expect(
			screen.getByText("Aún no se han agregado huéspedes"),
		).toBeInTheDocument();
	});

	it("should render selected guests list with names and role indicators", () => {
		render(
			<SelectedGuestsList
				selectedGuests={mockGuests}
				onChange={mockOnChange}
			/>,
		);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("Jane Smith")).toBeInTheDocument();

		expect(screen.getByText("Principal")).toBeInTheDocument();

		expect(screen.getByText("Huésped")).toBeInTheDocument();
	});

	it("should call onChange promoting a guest to primary when checkbox is clicked", async () => {
		const user = userEvent.setup();
		render(
			<SelectedGuestsList
				selectedGuests={mockGuests}
				onChange={mockOnChange}
			/>,
		);

		const janeCheckbox = screen.getByTestId("set-primary-checkbox-102");
		await user.click(janeCheckbox);

		expect(mockOnChange).toHaveBeenCalledWith([
			{ ...mockGuests[0], isPrimary: false },
			{ ...mockGuests[1], isPrimary: true },
		]);
	});

	it("should call onChange removing a guest when delete button is clicked", async () => {
		const user = userEvent.setup();
		render(
			<SelectedGuestsList
				selectedGuests={mockGuests}
				onChange={mockOnChange}
			/>,
		);

		const removeJaneButton = screen.getByTestId("remove-guest-102");
		await user.click(removeJaneButton);

		expect(mockOnChange).toHaveBeenCalledWith([mockGuests[0]]);
	});

	it("should auto-promote the next guest to primary if the primary guest is removed", async () => {
		const user = userEvent.setup();
		render(
			<SelectedGuestsList
				selectedGuests={mockGuests}
				onChange={mockOnChange}
			/>,
		);

		const removeJohnButton = screen.getByTestId("remove-guest-101");
		await user.click(removeJohnButton);

		expect(mockOnChange).toHaveBeenCalledWith([
			{ ...mockGuests[1], isPrimary: true },
		]);
	});
});
