import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "@/components/ui/Select";

describe("Select", () => {
	it("should render without crashing", () => {
		render(<Select />);
		expect(screen.getByTestId("select")).toBeInTheDocument();
	});

	it("should apply form-input class", () => {
		render(<Select />);
		const select = screen.getByTestId("select");
		expect(select).toHaveClass("form-input");
	});

	it("should render children", () => {
		render(
			<Select>
				<option value="1">Option 1</option>
			</Select>,
		);
		expect(screen.getByText("Option 1")).toBeInTheDocument();
	});
});
