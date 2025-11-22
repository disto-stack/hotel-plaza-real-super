import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import GuestCreateModal from "@/components/dashboard/guests/GuestCreateModal";
import { useCreateGuest } from "@/hooks/useGuests";

vi.mock("@/hooks/useGuests", () => ({
	useCreateGuest: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: {
		error: vi.fn(),
		success: vi.fn(),
	},
}));

describe("GuestCreateModal", () => {
	const mockMutateAsync = vi.fn();
	beforeEach(() => {
		vi.clearAllMocks();
		(useCreateGuest as Mock).mockReturnValue({
			mutateAsync: mockMutateAsync,
			isPending: false,
		} as unknown as ReturnType<typeof useCreateGuest>);
	});

	describe("when the modal is open", () => {
		it("should render the modal", () => {
			render(<GuestCreateModal open={true} onClose={() => {}} />);
			expect(screen.getByTestId("guest-create-modal")).toBeInTheDocument();
		});

		it("should render the form", () => {
			render(<GuestCreateModal open={true} onClose={() => {}} />);
			expect(screen.getByTestId("guest-create-form")).toBeInTheDocument();
		});

		it("should render the form fields", () => {
			render(<GuestCreateModal open={true} onClose={() => {}} />);
			expect(screen.getByTestId("first-name-input")).toBeInTheDocument();
			expect(screen.getByTestId("last-name-input")).toBeInTheDocument();
			expect(screen.getByTestId("phone-input")).toBeInTheDocument();
			expect(screen.getByTestId("document-type-input")).toBeInTheDocument();
			expect(screen.getByTestId("document-number-input")).toBeInTheDocument();
			expect(screen.getByTestId("occupation-input")).toBeInTheDocument();
		});

		it("should render the form buttons", () => {
			render(<GuestCreateModal open={true} onClose={() => {}} />);
			expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
			expect(screen.getByTestId("submit-button")).toBeInTheDocument();
		});
	});

	describe("when the form is submitted", () => {
		it("should call the mutateAsync function", async () => {
			const user = userEvent.setup();

			render(<GuestCreateModal open={true} onClose={() => {}} />);
			const firstNameInput = screen.getByTestId("first-name-input");
			const lastNameInput = screen.getByTestId("last-name-input");
			const phoneInput = screen.getByTestId("phone-input");
			const documentTypeInput = screen.getByTestId("document-type-input");
			const documentNumberInput = screen.getByTestId("document-number-input");
			const occupationInput = screen.getByTestId("occupation-input");

			await user.type(firstNameInput, "John");
			await user.type(lastNameInput, "Doe");
			await user.type(phoneInput, "1234567890");
			await user.type(documentTypeInput, "National ID");
			await user.type(documentNumberInput, "1234567890");
			await user.type(occupationInput, "Software Engineer");

			await user.tab();

			const submitButton = screen.getByTestId("submit-button");

			expect(submitButton).not.toBeDisabled();

			await user.click(submitButton);

			expect(mockMutateAsync).toHaveBeenCalledWith({
				firstName: "John",
				lastName: "Doe",
				phone: "1234567890",
				documentType: "National ID",
				documentNumber: "1234567890",
				occupation: "Software Engineer",
			});

			expect(toast.success).toHaveBeenCalledWith(
				"Huésped creado correctamente",
			);
			expect(toast.error).not.toHaveBeenCalled();
		});

		it("should not call the mutateAsync function when the form is invalid", async () => {
			const user = userEvent.setup();

			render(<GuestCreateModal open={true} onClose={() => {}} />);
			const submitButton = screen.getByTestId("submit-button");

			expect(submitButton).toBeDisabled();

			await user.click(submitButton);

			expect(mockMutateAsync).not.toHaveBeenCalled();
			expect(toast.success).not.toHaveBeenCalled();
			expect(toast.error).not.toHaveBeenCalled();
		});

		it("should call the mutateAsync function", async () => {
			const user = userEvent.setup();

			render(<GuestCreateModal open={true} onClose={() => {}} />);
			const firstNameInput = screen.getByTestId("first-name-input");

			await user.type(firstNameInput, "Jhon");

			await user.tab();

			const cancelButton = screen.getByTestId("cancel-button");

			expect(cancelButton).toBeEnabled();

			await user.click(cancelButton);

			expect(firstNameInput).toHaveValue("");
		});

		it("should show an error toast when the mutateAsync function fails", async () => {
			const user = userEvent.setup();

			const error = new Error("Error creating guest");
			mockMutateAsync.mockRejectedValue(error);

			render(<GuestCreateModal open={true} onClose={() => {}} />);
			const firstNameInput = screen.getByTestId("first-name-input");
			const lastNameInput = screen.getByTestId("last-name-input");
			const phoneInput = screen.getByTestId("phone-input");
			const documentTypeInput = screen.getByTestId("document-type-input");
			const documentNumberInput = screen.getByTestId("document-number-input");
			const occupationInput = screen.getByTestId("occupation-input");

			await user.type(firstNameInput, "John");
			await user.type(lastNameInput, "Doe");
			await user.type(phoneInput, "1234567890");
			await user.type(documentTypeInput, "National ID");
			await user.type(documentNumberInput, "1234567890");
			await user.type(occupationInput, "Software Engineer");

			await user.tab();

			const submitButton = screen.getByTestId("submit-button");

			await user.click(submitButton);

			expect(toast.error).toHaveBeenCalled();
			expect(toast.success).not.toHaveBeenCalled();
		});
	});

	describe("when the modal is closed", () => {
		it("should not render the modal", () => {
			render(<GuestCreateModal open={false} onClose={() => {}} />);
			expect(
				screen.queryByTestId("guest-create-modal"),
			).not.toBeInTheDocument();
		});
	});
});
