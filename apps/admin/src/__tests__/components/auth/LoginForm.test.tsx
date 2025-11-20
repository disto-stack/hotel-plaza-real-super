import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
			prefetch: vi.fn(),
			refresh: vi.fn(),
			forward: vi.fn(),
		} as unknown as ReturnType<typeof useRouter>);
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

		it("should change email value when user types", async () => {
			const user = userEvent.setup();
			render(<LoginForm />);
			const emailInput = screen.getByTestId("email-input");

			await user.type(emailInput, "test@example.com");

			expect(emailInput).toHaveValue("test@example.com");
		});

		it("should render password field", () => {
			render(<LoginForm />);
			expect(screen.getByTestId("password-input")).toBeInTheDocument();
		});

		it("should change password value when user types", async () => {
			const user = userEvent.setup();
			render(<LoginForm />);
			const passwordInput = screen.getByTestId("password-input");

			await user.type(passwordInput, "password123");

			expect(passwordInput).toHaveValue("password123");
		});
	});

	describe("form validation", () => {
		it("should show error when email is invalid", async () => {
			const user = userEvent.setup();
			render(<LoginForm />);

			const emailInput = screen.getByTestId("email-input");
			await user.type(emailInput, "invalid-email");
			await user.tab();

			await waitFor(() => {
				expect(
					screen.getByText("El correo electrónico no es válido"),
				).toBeInTheDocument();
			});
		});

		it("should show error when email is empty", async () => {
			const user = userEvent.setup();
			render(<LoginForm />);

			const emailInput = screen.getByTestId("email-input");
			await user.click(emailInput);
			await user.tab();

			await waitFor(() => {
				expect(
					screen.getByText("El correo electrónico no es válido"),
				).toBeInTheDocument();
			});
		});

		it("should show error when password is too short", async () => {
			const user = userEvent.setup();
			render(<LoginForm />);

			const passwordInput = screen.getByTestId("password-input");
			await user.type(passwordInput, "short");
			await user.tab();

			await waitFor(() => {
				expect(
					screen.getByText("La contraseña debe tener al menos 8 caracteres"),
				).toBeInTheDocument();
			});
		});

		it("should show error when password is empty", async () => {
			const user = userEvent.setup();
			render(<LoginForm />);

			const passwordInput = screen.getByTestId("password-input");
			await user.click(passwordInput);
			await user.tab();

			await waitFor(() => {
				expect(
					screen.getByText("La contraseña es requerida"),
				).toBeInTheDocument();
			});
		});

		it("should not show errors when form is valid", async () => {
			const user = userEvent.setup();
			render(<LoginForm />);

			const emailInput = screen.getByTestId("email-input");
			const passwordInput = screen.getByTestId("password-input");

			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "password123");
			await user.tab();

			await waitFor(() => {
				expect(
					screen.queryByText("El correo electrónico no es válido"),
				).not.toBeInTheDocument();
				expect(
					screen.queryByText("La contraseña debe tener al menos 8 caracteres"),
				).not.toBeInTheDocument();
			});
		});
	});

	describe("submit button", () => {
		it("should render submit button", () => {
			render(<LoginForm />);
			expect(screen.getByTestId("submit-button")).toBeInTheDocument();
		});

		it("should be disabled initially when form is invalid", () => {
			render(<LoginForm />);
			const submitButton = screen.getByTestId("submit-button");
			expect(submitButton).toBeDisabled();
		});

		it("should be enabled when form is valid", async () => {
			const user = userEvent.setup();
			render(<LoginForm />);

			const emailInput = screen.getByTestId("email-input");
			const passwordInput = screen.getByTestId("password-input");

			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "password123");
			await user.tab();

			await waitFor(() => {
				const submitButton = screen.getByTestId("submit-button");
				expect(submitButton).not.toBeDisabled();
			});
		});

		it("should be disabled when form has validation errors", async () => {
			const user = userEvent.setup();
			render(<LoginForm />);

			const emailInput = screen.getByTestId("email-input");
			await user.type(emailInput, "invalid-email");
			await user.tab();

			await waitFor(() => {
				const submitButton = screen.getByTestId("submit-button");
				expect(submitButton).toBeDisabled();
			});
		});
	});

	describe("handleLogin", () => {
		it("should call signIn and redirect on successful login", async () => {
			const user = userEvent.setup();
			mockSignIn.mockResolvedValue(undefined);

			render(<LoginForm />);

			const emailInput = screen.getByTestId("email-input");
			const passwordInput = screen.getByTestId("password-input");
			const submitButton = screen.getByTestId("submit-button");

			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "password123");
			await user.tab();

			await waitFor(() => {
				expect(submitButton).not.toBeDisabled();
			});

			await user.click(submitButton);

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

		it("should not submit form when validation fails", async () => {
			const user = userEvent.setup();
			render(<LoginForm />);

			const emailInput = screen.getByTestId("email-input");
			const passwordInput = screen.getByTestId("password-input");
			const submitButton = screen.getByTestId("submit-button");

			await user.type(emailInput, "invalid-email");
			await user.type(passwordInput, "short");

			await user.click(submitButton);

			await waitFor(() => {
				expect(mockSignIn).not.toHaveBeenCalled();
			});

			expect(mockPush).not.toHaveBeenCalled();
		});

		it("should show error toast on login failure", async () => {
			const user = userEvent.setup();
			const error = new Error("Invalid credentials");
			mockSignIn.mockRejectedValue(error);

			render(<LoginForm />);

			const emailInput = screen.getByTestId("email-input");
			const passwordInput = screen.getByTestId("password-input");
			const submitButton = screen.getByTestId("submit-button");

			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "password123");

			await user.tab();

			await waitFor(() => {
				expect(submitButton).not.toBeDisabled();
			});

			await user.click(submitButton);

			await waitFor(() => {
				expect(mockSignIn).toHaveBeenCalled();
			});

			await waitFor(() => {
				expect(toast.error).toHaveBeenCalled();
			});

			expect(mockPush).not.toHaveBeenCalled();
		});

		it("should disable submit button while loading", async () => {
			const user = userEvent.setup();
			mockSignIn.mockImplementation(() => new Promise(() => {}));

			render(<LoginForm />);

			const emailInput = screen.getByTestId("email-input");
			const passwordInput = screen.getByTestId("password-input");
			const submitButton = screen.getByTestId("submit-button");

			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "password123");
			await user.tab();

			await waitFor(() => {
				expect(submitButton).not.toBeDisabled();
			});

			await user.click(submitButton);

			await waitFor(() => {
				expect(submitButton).toBeDisabled();
			});

			expect(submitButton).toHaveTextContent("Iniciando sesión...");
		});
	});
});
