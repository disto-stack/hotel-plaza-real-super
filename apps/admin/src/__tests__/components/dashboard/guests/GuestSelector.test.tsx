import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	GuestSelector,
	type SelectedGuest,
} from "@/components/dashboard/guests/GuestSelector";
import { useGuests } from "@/hooks/useGuests";

vi.mock("@/hooks/useGuests", () => ({
	useGuests: vi.fn(),
}));

vi.mock("@/hooks/useDebounce", () => ({
	useDebounce: vi.fn((value) => value),
}));

vi.mock("sonner", () => ({
	toast: {
		error: vi.fn(),
		success: vi.fn(),
	},
}));

describe("GuestSelector", () => {
	const mockOnChange = vi.fn();

	const mockAllGuests = [
		{
			id: "101",
			firstName: "John",
			lastName: "Doe",
			email: "john@example.com",
			phone: "12345",
			documentType: "National ID",
			documentNumber: "12345678",
			nationality: "Venezuelan",
			occupation: "Driver",
		},
		{
			id: "102",
			firstName: "Jane",
			lastName: "Smith",
			email: "jane@example.com",
			phone: "67890",
			documentType: "Identity Card",
			documentNumber: "87654321",
			nationality: "Venezuelan",
			occupation: "Doctor",
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useGuests).mockReturnValue({
			data: {
				guests: mockAllGuests,
				totalCount: mockAllGuests.length,
				page: 1,
				limit: 5,
			},
			isLoading: false,
		} as any);
	});

	it("should render empty state when no guests are selected", () => {
		render(<GuestSelector selectedGuests={[]} onChange={mockOnChange} />);

		expect(screen.getByTestId("guests-empty-state")).toBeInTheDocument();
		expect(
			screen.getByText("Aún no se han agregado huéspedes"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Busca huéspedes existentes o usa Agregar rápido"),
		).toBeInTheDocument();
	});

	it("should search and display matching results and allow selection", async () => {
		const user = userEvent.setup();
		render(<GuestSelector selectedGuests={[]} onChange={mockOnChange} />);

		const searchInput = screen.getByTestId("guest-search-input");
		await user.type(searchInput, "John");

		const resultButton = screen.getByTestId("guest-result-101");
		expect(resultButton).toBeInTheDocument();
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(
			screen.getByText("National ID 12345678 • john@example.com"),
		).toBeInTheDocument();

		await user.click(resultButton);

		expect(mockOnChange).toHaveBeenCalledWith([
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
		]);
	});

	it("should open and close the Quick Add form panel", async () => {
		const user = userEvent.setup();
		render(<GuestSelector selectedGuests={[]} onChange={mockOnChange} />);

		const quickAddButton = screen.getByTestId("quick-add-button");
		await user.click(quickAddButton);

		expect(screen.getByTestId("quick-add-form-container")).toBeInTheDocument();
		expect(screen.getByText("Agregar huésped rápido")).toBeInTheDocument();

		const closeButton = screen.getByTestId("close-quick-add");
		await user.click(closeButton);

		expect(
			screen.queryByTestId("quick-add-form-container"),
		).not.toBeInTheDocument();
	});

	it("should successfully submit the Quick Add form and call onChange", async () => {
		const user = userEvent.setup();

		render(<GuestSelector selectedGuests={[]} onChange={mockOnChange} />);

		// Open Form
		await user.click(screen.getByTestId("quick-add-button"));

		// Fill in Form
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
		expect(submitButton).not.toBeDisabled();

		await user.click(submitButton);

		expect(mockOnChange).toHaveBeenCalledWith([
			{
				guestId: expect.stringMatching(/^temp-/),
				firstName: "Alice",
				lastName: "Wonderland",
				email: "alice@example.com",
				phone: "112233",
				documentType: "Passport",
				documentNumber: "P-99999",
				isPrimary: true,
			},
		]);
	});

	it("should display selected guests and handle primary status changes and deletion", async () => {
		const user = userEvent.setup();
		const selectedGuests: SelectedGuest[] = [
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
				documentType: "Identity Card",
				documentNumber: "87654321",
				isPrimary: false,
			},
		];

		render(
			<GuestSelector selectedGuests={selectedGuests} onChange={mockOnChange} />,
		);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("Jane Smith")).toBeInTheDocument();

		expect(screen.getByText("Principal")).toBeInTheDocument();

		expect(screen.getByText("Huésped")).toBeInTheDocument();

		const janeCheckbox = screen.getByTestId("set-primary-checkbox-102");
		await user.click(janeCheckbox);

		expect(mockOnChange).toHaveBeenCalledWith([
			{ ...selectedGuests[0], isPrimary: false },
			{ ...selectedGuests[1], isPrimary: true },
		]);

		const removeJohnButton = screen.getByTestId("remove-guest-101");
		await user.click(removeJohnButton);

		expect(mockOnChange).toHaveBeenCalledWith([
			{ ...selectedGuests[1], isPrimary: true },
		]);
	});
});
