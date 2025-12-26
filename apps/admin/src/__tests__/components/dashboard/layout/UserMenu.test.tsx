import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserMenu from "@/components/dashboard/layout/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { authStore } from "@/store/authStore";

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

vi.mock("@/store/authStore");

const mockUseAuthStore = {
	user: {
		first_name: "John",
		last_name: "Doe",
		email: "john.doe@example.com",
	},
	isAuthenticated: true,
	isLoading: false,
	setUser: vi.fn(),
	setLoading: vi.fn(),
	logout: vi.fn(),
};

describe("UserMenu", () => {
	const mockSignOut = vi.fn();
	const mockPush = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(authStore).mockReturnValue(mockUseAuthStore);

		vi.mocked(useAuth).mockReturnValue({
			signIn: vi.fn(),
			signOut: mockSignOut,
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
		render(<UserMenu />);
		expect(screen.getByTestId("user-menu-trigger")).toBeInTheDocument();
	});

	it("should render the user name and email", async () => {
		render(<UserMenu />);

		const user = userEvent.setup();
		await user.click(screen.getByTestId("user-menu-trigger"));

		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
	});

	describe("sign out button", () => {
		it("should trigger the sign out button and redirect to login page", async () => {
			render(<UserMenu />);

			const user = userEvent.setup();

			await user.click(screen.getByTestId("user-menu-trigger"));

			const signOutButton = screen.getByTestId("sign-out-button");
			expect(signOutButton).toBeInTheDocument();

			await user.click(signOutButton);

			expect(mockSignOut).toHaveBeenCalled();
			expect(mockPush).toHaveBeenCalledWith("/login");
		});

		it("should show an error toast when the sign out fails", async () => {
			const error = new Error("Error al cerrar sesión");
			mockSignOut.mockRejectedValue(error);

			render(<UserMenu />);

			const user = userEvent.setup();

			await user.click(screen.getByTestId("user-menu-trigger"));

			const signOutButton = screen.getByTestId("sign-out-button");
			expect(signOutButton).toBeInTheDocument();

			await user.click(signOutButton);

			expect(toast.error).toHaveBeenCalledWith("Error al cerrar sesión");
		});
	});
});
