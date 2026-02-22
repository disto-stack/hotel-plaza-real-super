import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ThemeSwitcher from "@/components/dashboard/layout/ThemeSwitcher";

describe("ThemeSwitcher", () => {
	it("should render without crashing", () => {
		render(<ThemeSwitcher />);
		expect(screen.getByTestId("theme-toggle-button")).toBeInTheDocument();
	});
});
