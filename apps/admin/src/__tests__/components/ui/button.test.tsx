import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
	it("should render without crashing", () => {
		render(<Button>Click me</Button>);
		expect(
			screen.getByRole("button", { name: "Click me" }),
		).toBeInTheDocument();
	});

	it("should apply default variant styles", () => {
		render(<Button>Button</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("bg-primary");
	});
});
