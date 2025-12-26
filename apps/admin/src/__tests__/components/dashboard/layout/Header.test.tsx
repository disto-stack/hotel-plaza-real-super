import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "@/components/dashboard/layout/Header";

describe("Header", () => {
	it("should render without crashing", () => {
		render(<Header />);
		expect(screen.getByTestId("header")).toBeInTheDocument();
	});
});
