import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GuestQuickAddForm } from "@/components/dashboard/guests/GuestQuickAddForm";

describe("GuestQuickAddForm", () => {
	const mockOnSubmit = vi.fn();
	const mockOnClose = vi.fn();

	it("should render all form inputs and close button", () => {
		render(
			<GuestQuickAddForm
				onSubmit={mockOnSubmit}
				onClose={mockOnClose}
				isPrimary={true}
			/>,
		);

		expect(screen.getByText("Agregar huésped rápido")).toBeInTheDocument();
		expect(screen.getByTestId("first-name-input")).toBeInTheDocument();
		expect(screen.getByTestId("last-name-input")).toBeInTheDocument();
		expect(screen.getByTestId("phone-input")).toBeInTheDocument();
		expect(screen.getByTestId("document-type-input")).toBeInTheDocument();
		expect(screen.getByTestId("document-number-input")).toBeInTheDocument();
		expect(screen.getByTestId("email-input")).toBeInTheDocument();
		expect(screen.getByTestId("occupation-input")).toBeInTheDocument();
		expect(screen.getByTestId("close-quick-add")).toBeInTheDocument();
	});

	it("should call onClose when close button is clicked", async () => {
		const user = userEvent.setup();
		render(
			<GuestQuickAddForm
				onSubmit={mockOnSubmit}
				onClose={mockOnClose}
				isPrimary={true}
			/>,
		);

		await user.click(screen.getByTestId("close-quick-add"));
		expect(mockOnClose).toHaveBeenCalled();
	});

	it("should disable submit button when form is invalid, and enable when valid", async () => {
		const user = userEvent.setup();
		render(
			<GuestQuickAddForm
				onSubmit={mockOnSubmit}
				onClose={mockOnClose}
				isPrimary={true}
			/>,
		);

		const submitButton = screen.getByTestId("add-guest-submit");
		expect(submitButton).toBeDisabled();

		await user.type(screen.getByTestId("first-name-input"), "Alice");
		await user.type(screen.getByTestId("last-name-input"), "Wonderland");
		await user.type(screen.getByTestId("phone-input"), "112233");
		await user.type(screen.getByTestId("document-number-input"), "P-99999");

		await user.tab();

		expect(submitButton).not.toBeDisabled();
	});

	it("should submit mapped guest data with generated temporary ID", async () => {
		const user = userEvent.setup();
		render(
			<GuestQuickAddForm
				onSubmit={mockOnSubmit}
				onClose={mockOnClose}
				isPrimary={true}
			/>,
		);

		await user.type(screen.getByTestId("first-name-input"), "Alice");
		await user.type(screen.getByTestId("last-name-input"), "Wonderland");
		await user.type(screen.getByTestId("phone-input"), "112233");
		await user.selectOptions(
			screen.getByTestId("document-type-input"),
			"Passport",
		);
		await user.type(screen.getByTestId("document-number-input"), "P-99999");
		await user.type(screen.getByTestId("email-input"), "alice@example.com");

		await user.tab();

		const submitButton = screen.getByTestId("add-guest-submit");
		await user.click(submitButton);

		expect(mockOnSubmit).toHaveBeenCalledWith(
			expect.objectContaining({
				guestId: expect.stringMatching(/^temp-/),
				firstName: "Alice",
				lastName: "Wonderland",
				email: "alice@example.com",
				phone: "112233",
				documentType: "Passport",
				documentNumber: "P-99999",
				isPrimary: true,
			}),
		);
	});
});
