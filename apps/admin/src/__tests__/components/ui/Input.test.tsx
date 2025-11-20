import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
	it("should render without crashing", () => {
		render(<Input />);
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("should apply form-input class", () => {
		render(<Input />);
		const input = screen.getByRole("textbox");
		expect(input).toHaveClass("form-input");
	});
});
