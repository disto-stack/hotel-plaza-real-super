import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RootLayout from "@/app/layout";

describe("RootLayout", () => {
	it("should render children correctly", () => {
		const TestChild = () => <div>Test Content</div>;

		render(
			<RootLayout>
				<TestChild />
			</RootLayout>,
		);

		expect(screen.getByText("Test Content")).toBeInTheDocument();
	});

	it("should set the correct language attribute", () => {
		const TestChild = () => <div>Test</div>;

		const { container } = render(
			<RootLayout>
				<TestChild />
			</RootLayout>,
		);

		const html = container.querySelector("html");
		expect(html).toHaveAttribute("lang", "es");
	});

	it("should apply font classes to body", () => {
		const TestChild = () => <div>Test</div>;

		const { container } = render(
			<RootLayout>
				<TestChild />
			</RootLayout>,
		);

		const body = container.querySelector("body");
		expect(body).toHaveClass("antialiased");
		expect(body?.className).toContain("--font-inter");
		expect(body?.className).toContain("--font-poppins");
		expect(body?.className).toContain("--font-jetbrains-mono");
	});
});
