import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getStayTypeIcon } from "@/lib/icon-utils";
import { StayType } from "@/lib/types/occupation.types";

vi.mock("lucide-react", () => ({
	Moon: ({ size }: { size: number }) => (
		<svg data-testid="moon-icon" data-size={size} />
	),
	Clock: ({ size }: { size: number }) => (
		<svg data-testid="clock-icon" data-size={size} />
	),
}));

describe("icon-utils", () => {
	it("should return Moon icon for NIGHTLY stay type", () => {
		const { getByTestId } = render(getStayTypeIcon(StayType.NIGHTLY));
		const icon = getByTestId("moon-icon");
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute("data-size", "16");
	});

	it("should return Clock icon for HOURLY stay type", () => {
		const { getByTestId } = render(getStayTypeIcon(StayType.HOURLY));
		const icon = getByTestId("clock-icon");
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute("data-size", "16");
	});

	it("should return icon with custom size", () => {
		const { getByTestId } = render(getStayTypeIcon(StayType.NIGHTLY, 24));
		const icon = getByTestId("moon-icon");
		expect(icon).toHaveAttribute("data-size", "24");
	});
});
