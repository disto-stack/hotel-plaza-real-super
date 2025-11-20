import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

describe("Table", () => {
	it("should render without crashing", () => {
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Header</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>Cell</TableCell>
					</TableRow>
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell>Footer</TableCell>
					</TableRow>
				</TableFooter>
				<TableCaption>Caption</TableCaption>
			</Table>,
		);
		expect(screen.getByText("Header")).toBeInTheDocument();
		expect(screen.getByText("Cell")).toBeInTheDocument();
		expect(screen.getByText("Footer")).toBeInTheDocument();
		expect(screen.getByText("Caption")).toBeInTheDocument();
	});
});
