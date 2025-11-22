/** biome-ignore-all lint/suspicious/noExplicitAny: For mocking */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GuestsPage from "@/app/(dashboard)/guests/page";
import { useCreateGuest, useGuests } from "@/hooks/useGuests";
import type { Guest } from "@/lib/types/guest.types";

vi.mock("@/hooks/useGuests", () => ({
	useGuests: vi.fn(),
	useCreateGuest: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: {
		error: vi.fn(),
		success: vi.fn(),
	},
}));

describe("Guests Page", () => {
	const mockGuests: Guest[] = [
		{
			id: "1",
			first_name: "John",
			last_name: "Doe",
			email: "john@example.com",
			phone: "1234567890",
			document_type: "DNI",
			document_number: "12345678",
			nationality: "Peru",
			occupation: "Engineer",
			created_at: "2024-01-01T00:00:00Z",
			updated_at: "2024-01-01T00:00:00Z",
		},
		{
			id: "2",
			first_name: "Jane",
			last_name: "Smith",
			email: "jane@example.com",
			phone: "0987654321",
			document_type: "CE",
			document_number: "87654321",
			nationality: "Colombia",
			occupation: "Designer",
			created_at: "2024-01-02T00:00:00Z",
			updated_at: "2024-01-02T00:00:00Z",
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useGuests).mockReturnValue({
			data: [],
			isLoading: false,
			error: null,
			isSuccess: true,
			isError: false,
			isPending: false,
			isRefetching: false,
			isFetching: false,
			isStale: false,
			isLoadingError: false,
			isRefetchError: false,
			isPlaceholderData: false,
		} as any);

		vi.mocked(useCreateGuest).mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as any);
	});

	it("should render without crashing", () => {
		render(<GuestsPage />);
		expect(screen.getByTestId("guests-page")).toBeInTheDocument();
	});

	it("should render the page header with title and description", () => {
		render(<GuestsPage />);

		expect(
			screen.getByRole("heading", { name: /huéspedes/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/aquí puedes ver todos los huéspedes registrados en el sistema/i,
			),
		).toBeInTheDocument();
	});

	it("should render the search bar", () => {
		render(<GuestsPage />);

		const searchInput = screen.getByTestId("search-bar-input");
		expect(searchInput).toBeInTheDocument();
		expect(searchInput).toHaveAttribute(
			"placeholder",
			"Buscar huésped por nombre, apellido o número de documento",
		);
	});

	it("should render the add guest button", () => {
		render(<GuestsPage />);

		const addButton = screen.getByRole("button", { name: /agregar huésped/i });
		expect(addButton).toBeInTheDocument();
	});

	it("should show loading state when isLoading is true", () => {
		vi.mocked(useGuests).mockReturnValue({
			data: undefined,
			isLoading: true,
			error: null,
			isSuccess: false,
			isError: false,
			isPending: true,
			isRefetching: false,
			isFetching: true,
			isStale: false,
			isLoadingError: false,
			isRefetchError: false,
			isPlaceholderData: false,
		} as any);

		render(<GuestsPage />);

		expect(screen.getByText(/cargando.../i)).toBeInTheDocument();
	});

	it("should show error message when error occurs", () => {
		vi.mocked(useGuests).mockReturnValue({
			data: undefined,
			isLoading: false,
			error: new Error("Failed to fetch"),
			isSuccess: false,
			isError: true,
			isPending: false,
			isRefetching: false,
			isFetching: false,
			isStale: false,
			isLoadingError: true,
			isRefetchError: false,
			isPlaceholderData: false,
		} as any);

		render(<GuestsPage />);

		expect(
			screen.getByText(
				/no se pudieron cargar los huéspedes. por favor, intente nuevamente/i,
			),
		).toBeInTheDocument();
	});

	it("should render guests table when guests data is available", () => {
		vi.mocked(useGuests).mockReturnValue({
			data: mockGuests,
			isLoading: false,
			error: null,
			isSuccess: true,
			isError: false,
			isPending: false,
			isRefetching: false,
			isFetching: false,
			isStale: false,
			isLoadingError: false,
			isRefetchError: false,
			isPlaceholderData: false,
		} as any);

		const { container } = render(<GuestsPage />);

		expect(container.querySelector("table")).toBeInTheDocument();
	});

	it("should open create modal when add button is clicked", async () => {
		const user = userEvent.setup();
		render(<GuestsPage />);

		const addButton = screen.getByRole("button", { name: /agregar huésped/i });
		await user.click(addButton);

		expect(screen.getByTestId("guest-create-form")).toBeInTheDocument();
	});

	it("should not show loading or error when guests are loaded successfully", () => {
		vi.mocked(useGuests).mockReturnValue({
			data: mockGuests,
			isLoading: false,
			error: null,
			isSuccess: true,
			isError: false,
			isPending: false,
			isRefetching: false,
			isFetching: false,
			isStale: false,
			isLoadingError: false,
			isRefetchError: false,
			isPlaceholderData: false,
		} as any);

		render(<GuestsPage />);

		expect(screen.queryByText(/cargando.../i)).not.toBeInTheDocument();
		expect(
			screen.queryByText(
				/no se pudieron cargar los huéspedes. por favor, intente nuevamente/i,
			),
		).not.toBeInTheDocument();
	});

	it("should not render table when guests array is empty", () => {
		vi.mocked(useGuests).mockReturnValue({
			data: [],
			isLoading: false,
			error: null,
			isSuccess: true,
			isError: false,
			isPending: false,
			isRefetching: false,
			isFetching: false,
			isStale: false,
			isLoadingError: false,
			isRefetchError: false,
			isPlaceholderData: false,
		} as any);

		render(<GuestsPage />);

		expect(screen.queryByText("John")).not.toBeInTheDocument();
		expect(screen.queryByText("Jane")).not.toBeInTheDocument();
	});
});
