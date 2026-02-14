/** biome-ignore-all lint/suspicious/noExplicitAny: For testing purposes */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable } from "@/components/shared/data-display/DataTable";

describe("DataTable", () => {
	it("should render without crashing", () => {
		render(<DataTable columns={[]} data={[]} />);

		const table = screen.getByTestId("data-table");

		expect(table).toBeInTheDocument();
	});

	it("should render with headers and data", () => {
		render(
			<DataTable
				columns={[
					{
						id: "id",
						header: "ID",
						cell: (row: any) => row.id,
					},
				]}
				data={[{ id: 1 }]}
			/>,
		);

		const tableHeader = screen.getByTestId("data-table-header-id");
		const tableRow = screen.getByTestId("data-table-row-0");

		expect(tableHeader).toBeInTheDocument();
		expect(tableRow).toBeInTheDocument();
	});
});
