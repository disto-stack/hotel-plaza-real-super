import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "@/components/ui/Label";

describe("Label", () => {
	it("should render without crashing", () => {
		render(<Label>Test Label</Label>);
		expect(screen.getByText("Test Label")).toBeInTheDocument();
	});

	it("should apply default classes", () => {
		render(<Label>Test Label</Label>);
		const label = screen.getByText("Test Label");
		expect(label).toHaveClass("text-sm", "font-medium");
	});
});
