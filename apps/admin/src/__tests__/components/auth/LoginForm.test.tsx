import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: {
		error: vi.fn(),
		success: vi.fn(),
	},
}));

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

describe("LoginForm", () => {
	const mockSignIn = vi.fn();
	const mockPush = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(useAuth).mockReturnValue({
			signIn: mockSignIn,
			signOut: vi.fn(),
		});

		vi.mocked(useRouter).mockReturnValue({
			push: mockPush,
			replace: vi.fn(),
			back: vi.fn(),
		} as any);
	});

	it("should render without crashing", () => {
		render(<LoginForm />);
		expect(screen.getByTestId("login-form")).toBeInTheDocument();
	});

	describe("form fields", () => {
		it("should render email field", () => {
			render(<LoginForm />);
			expect(screen.getByTestId("email-input")).toBeInTheDocument();
		});

		it("should change email value when user types", () => {
			render(<LoginForm />);
			const emailInput = screen.getByTestId("email-input");
			fireEvent.change(emailInput, { target: { value: "test@example.com" } });
			expect(emailInput).toHaveAttribute("value", "test@example.com");
		});

		it("should render password field", () => {
			render(<LoginForm />);
			expect(screen.getByTestId("password-input")).toBeInTheDocument();
		});

		it("should change password value when user types", () => {
			render(<LoginForm />);
			const passwordInput = screen.getByTestId("password-input");
			fireEvent.change(passwordInput, { target: { value: "password" } });
			expect(passwordInput).toHaveValue("password");
		});
	});

	describe("submit button", () => {
		it("should render submit button", () => {
			render(<LoginForm />);
			expect(screen.getByTestId("submit-button")).toBeInTheDocument();
		});

		it("should be enabled when form is valid", () => {
			render(<LoginForm />);
			const emailInput = screen.getByTestId("email-input");
			const passwordInput = screen.getByTestId("password-input");

			fireEvent.change(emailInput, { target: { value: "test@example.com" } });
			fireEvent.change(passwordInput, { target: { value: "password" } });

			const submitButton = screen.getByTestId("submit-button");
			expect(submitButton).not.toHaveAttribute("disabled");
		});
	});

	describe("handleLogin", () => {
		it("should call signIn and redirect on successful login", async () => {
			mockSignIn.mockResolvedValue(undefined);

			render(<LoginForm />);

			const emailInput = screen.getByTestId("email-input");
			const passwordInput = screen.getByTestId("password-input");
			const submitButton = screen.getByTestId("submit-button");

			fireEvent.change(emailInput, { target: { value: "test@example.com" } });
			fireEvent.change(passwordInput, { target: { value: "password123" } });
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(mockSignIn).toHaveBeenCalledWith(
					"test@example.com",
					"password123",
				);
			});

			await waitFor(() => {
				expect(mockPush).toHaveBeenCalledWith("/guests");
			});
		});

		it("should show error toast on login failure", async () => {
			const error = new Error("Invalid credentials");
			mockSignIn.mockRejectedValue(error);

			render(<LoginForm />);

			const emailInput = screen.getByTestId("email-input");
			const passwordInput = screen.getByTestId("password-input");
			const submitButton = screen.getByTestId("submit-button");

			fireEvent.change(emailInput, { target: { value: "test@example.com" } });
			fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(mockSignIn).toHaveBeenCalled();
			});

			await waitFor(() => {
				expect(toast.error).toHaveBeenCalled();
			});

			expect(mockPush).not.toHaveBeenCalled();
		});

		it("should disable submit button while loading", async () => {
			mockSignIn.mockImplementation(() => new Promise(() => {}));

			render(<LoginForm />);

			const emailInput = screen.getByTestId("email-input");
			const passwordInput = screen.getByTestId("password-input");
			const submitButton = screen.getByTestId("submit-button");

			fireEvent.change(emailInput, { target: { value: "test@example.com" } });
			fireEvent.change(passwordInput, { target: { value: "password123" } });
			fireEvent.click(submitButton);

			await waitFor(() => {
				expect(submitButton).toBeDisabled();
			});

			expect(submitButton).toHaveTextContent("Iniciando sesión...");
		});
	});
});
