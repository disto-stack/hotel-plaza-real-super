import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("Home Page", () => {
	it("renders the Next.js welcome page", () => {
		render(<Home />);
		// Use a more flexible text matcher
		expect(screen.getByText(/Get started by editing/)).toBeInTheDocument();
	});

	it("renders the Next.js logo", () => {
		render(<Home />);
		const logo = screen.getByAltText("Next.js logo");
		expect(logo).toBeInTheDocument();
	});

	it("renders the Vercel logo", () => {
		render(<Home />);
		const vercelLogo = screen.getByAltText("Vercel logomark");
		expect(vercelLogo).toBeInTheDocument();
	});

	it("renders the main content area", () => {
		render(<Home />);
		const main = screen.getByRole("main");
		expect(main).toBeInTheDocument();
	});

	it("renders the footer", () => {
		render(<Home />);
		const footer = screen.getByRole("contentinfo");
		expect(footer).toBeInTheDocument();
	});

	it("renders the deploy button", () => {
		render(<Home />);
		const deployButton = screen.getByText("Deploy now");
		expect(deployButton).toBeInTheDocument();
	});

	it("renders the docs button", () => {
		render(<Home />);
		const docsButton = screen.getByText("Read our docs");
		expect(docsButton).toBeInTheDocument();
	});
});
