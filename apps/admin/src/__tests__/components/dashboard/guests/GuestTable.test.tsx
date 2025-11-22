import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GuestsTable from "@/components/dashboard/guests/GuestTable";
import type { Guest } from "@/lib/types/guest.types";

describe("GuestsTable", () => {
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

	it("should render without crashing", () => {
		render(<GuestsTable guests={mockGuests} />);
		expect(screen.getByRole("table")).toBeInTheDocument();
	});

	it("should render table headers", () => {
		render(<GuestsTable guests={mockGuests} />);

		expect(screen.getByText("Nombres")).toBeInTheDocument();
		expect(screen.getByText("Apellidos")).toBeInTheDocument();
		expect(screen.getByText("Ocupación")).toBeInTheDocument();
		expect(screen.getByText("Teléfono")).toBeInTheDocument();
		expect(screen.getByText("Número de documento")).toBeInTheDocument();
	});

	it("should render guest data in table rows", () => {
		render(<GuestsTable guests={mockGuests} />);

		const rows = screen.getAllByRole("row");
		expect(rows).toHaveLength(3);
	});

	it("should not render table when guests array is empty", () => {
		const { container } = render(<GuestsTable guests={[]} />);

		expect(container.querySelector("table")).not.toBeInTheDocument();
	});

	it("should render correct number of rows for multiple guests", () => {
		render(<GuestsTable guests={mockGuests} />);

		const tableBody = screen.getByRole("table").querySelector("tbody");
		const rows = tableBody?.querySelectorAll("tr") || [];

		expect(rows.length).toBe(2);
	});

	it("should render table structure correctly", () => {
		const { container } = render(<GuestsTable guests={mockGuests} />);

		const table = container.querySelector("table");
		expect(table).toBeInTheDocument();

		const thead = table?.querySelector("thead");
		expect(thead).toBeInTheDocument();

		const tbody = table?.querySelector("tbody");
		expect(tbody).toBeInTheDocument();
	});

	it("should handle single guest correctly", () => {
		const singleGuest: Guest[] = [mockGuests[0]];
		render(<GuestsTable guests={singleGuest} />);

		const tableBody = screen.getByRole("table").querySelector("tbody");
		const rows = tableBody?.querySelectorAll("tr") || [];
		expect(rows.length).toBe(1);
	});

	it("should render table wrapper with correct structure", () => {
		const { container } = render(<GuestsTable guests={mockGuests} />);

		const wrapper = container.firstChild;
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveClass("rounded-2xl", "border", "border-border");
	});
});
