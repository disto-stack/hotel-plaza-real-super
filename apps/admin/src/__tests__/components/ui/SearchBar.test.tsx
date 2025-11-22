import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchBar } from "@/components/ui/SearchBar";

describe("Input", () => {
	it("should render without crashing", () => {
		render(<SearchBar />);
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("should render search icon", () => {
		render(<SearchBar />);
		expect(screen.getByTestId("search-bar-icon")).toBeInTheDocument();
	});

	it("should render search input", () => {
		render(<SearchBar />);
		expect(screen.getByTestId("search-bar-input")).toBeInTheDocument();
	});
});
