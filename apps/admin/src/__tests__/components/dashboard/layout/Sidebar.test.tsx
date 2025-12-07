import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Sidebar from "@/components/dashboard/layout/Sidebar";

describe("Sidebar", () => {
	it("should render without crashing", () => {
		render(<Sidebar />);
		expect(screen.getByTestId("sidebar")).toBeInTheDocument();
	});

	it("should render the sidebar logo", () => {
		render(<Sidebar />);
		expect(screen.getByAltText("Hotel Plaza Real Logo")).toBeInTheDocument();
	});

	it("should render the sidebar title", () => {
		render(<Sidebar />);
		expect(screen.getByText("Plaza Real")).toBeInTheDocument();
	});

	it("should render the sidebar description", () => {
		render(<Sidebar />);
		expect(screen.getByText("Panel de administración")).toBeInTheDocument();
	});

	it("should render the sidebar items", () => {
		render(<Sidebar />);
		expect(screen.getByText("Huéspedes")).toBeInTheDocument();
	});
});
