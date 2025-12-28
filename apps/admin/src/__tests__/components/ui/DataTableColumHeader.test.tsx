/** biome-ignore-all lint/suspicious/noExplicitAny: For testing purposes */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";

describe("DataTableColumnHeader", () => {
	it("should render without crashing", () => {
		render(
			<DataTableColumnHeader
				column={{ getCanSort: () => false, getIsSorted: () => false } as any}
				title="Test title"
			/>,
		);

		const tableColumnHeaderWithoutSorting = screen.getByTestId(
			"data-table-column-header-without-sorting",
		);

		expect(tableColumnHeaderWithoutSorting).toBeInTheDocument();
		expect(tableColumnHeaderWithoutSorting.textContent).toBe("Test title");
	});

	describe("with sorting", () => {
		it("should render with sorting and be sorted by default", () => {
			render(
				<DataTableColumnHeader
					column={{ getCanSort: () => true, getIsSorted: () => false } as any}
					title="Test title"
				/>,
			);

			const tableColumnHeaderWithSorting = screen.getByTestId(
				"data-table-column-header-with-sorting",
			);

			const sortButton = screen.getByTestId("sort-button");
			expect(sortButton).toBeInTheDocument();
			expect(sortButton).not.toHaveClass("text-primary");

			expect(tableColumnHeaderWithSorting).toBeInTheDocument();
			expect(tableColumnHeaderWithSorting.textContent).toBe("Test title");

			expect(screen.getByTestId("sort-button-up-down")).toBeInTheDocument();
		});

		it("should render with sorting and be sorted asc", () => {
			render(
				<DataTableColumnHeader
					column={{ getCanSort: () => true, getIsSorted: () => "asc" } as any}
					title="Test title"
				/>,
			);

			const tableColumnHeaderWithSorting = screen.getByTestId(
				"data-table-column-header-with-sorting",
			);

			const sortButton = screen.getByTestId("sort-button");
			expect(sortButton).toBeInTheDocument();
			expect(sortButton).toHaveClass("text-primary");

			expect(tableColumnHeaderWithSorting).toBeInTheDocument();
			expect(tableColumnHeaderWithSorting.textContent).toBe("Test title");

			expect(screen.getByTestId("sort-button-up")).toBeInTheDocument();
		});

		it("should render with sorting and be sorted desc", () => {
			render(
				<DataTableColumnHeader
					column={{ getCanSort: () => true, getIsSorted: () => "desc" } as any}
					title="Test title"
				/>,
			);

			const tableColumnHeaderWithSorting = screen.getByTestId(
				"data-table-column-header-with-sorting",
			);

			const sortButton = screen.getByTestId("sort-button");
			expect(sortButton).toBeInTheDocument();
			expect(sortButton).toHaveClass("text-primary");

			expect(tableColumnHeaderWithSorting).toBeInTheDocument();
			expect(tableColumnHeaderWithSorting.textContent).toBe("Test title");

			expect(screen.getByTestId("sort-button-down")).toBeInTheDocument();
		});
	});
});
