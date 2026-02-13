import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ViewSwitcher from "@/components/shared/data-display/ViewSwitcher";

describe("ViewSwitcher", () => {
	it("should render without crashing", () => {
		render(<ViewSwitcher />);

		expect(screen.getByTestId("view-switcher")).toBeInTheDocument();
		expect(screen.getByTestId("view-switcher-list")).toBeInTheDocument();
		expect(screen.getByTestId("view-switcher-grid")).toBeInTheDocument();
	});

	describe("default value", () => {
		it("should default to 'list' when no defaultValue is provided", () => {
			render(<ViewSwitcher />);

			const listButton = screen.getByTestId("view-switcher-list");
			const gridButton = screen.getByTestId("view-switcher-grid");

			expect(listButton).toHaveAttribute("data-state", "on");
			expect(gridButton).toHaveAttribute("data-state", "off");
		});

		it("should use custom defaultValue when provided", () => {
			render(<ViewSwitcher defaultValue="grid" />);

			const listButton = screen.getByTestId("view-switcher-list");
			const gridButton = screen.getByTestId("view-switcher-grid");

			expect(listButton).toHaveAttribute("data-state", "off");
			expect(gridButton).toHaveAttribute("data-state", "on");
		});
	});

	describe("when changing the view", () => {
		it("should switch from list to grid", async () => {
			const user = userEvent.setup();
			const onValueChange = vi.fn();

			render(<ViewSwitcher onValueChange={onValueChange} />);

			const listButton = screen.getByTestId("view-switcher-list");
			const gridButton = screen.getByTestId("view-switcher-grid");

			expect(listButton).toHaveAttribute("data-state", "on");
			expect(gridButton).toHaveAttribute("data-state", "off");

			await user.click(gridButton);

			expect(onValueChange).toHaveBeenCalledWith("grid");
			expect(onValueChange).toHaveBeenCalledTimes(1);

			expect(listButton).toHaveAttribute("data-state", "off");
			expect(gridButton).toHaveAttribute("data-state", "on");
		});

		it("should switch from grid to list", async () => {
			const user = userEvent.setup();
			const onValueChange = vi.fn();

			render(
				<ViewSwitcher defaultValue="grid" onValueChange={onValueChange} />,
			);

			const listButton = screen.getByTestId("view-switcher-list");
			const gridButton = screen.getByTestId("view-switcher-grid");

			expect(gridButton).toHaveAttribute("data-state", "on");

			await user.click(listButton);

			expect(onValueChange).toHaveBeenCalledWith("list");
			expect(onValueChange).toHaveBeenCalledTimes(1);

			expect(listButton).toHaveAttribute("data-state", "on");
			expect(gridButton).toHaveAttribute("data-state", "off");
		});
	});

	describe("preventing deselection", () => {
		it("should not deselect when clicking the already selected button", async () => {
			const user = userEvent.setup();
			const onValueChange = vi.fn();

			render(<ViewSwitcher onValueChange={onValueChange} />);

			const listButton = screen.getByTestId("view-switcher-list");
			const gridButton = screen.getByTestId("view-switcher-grid");

			expect(listButton).toHaveAttribute("data-state", "on");
			await user.click(listButton);

			expect(onValueChange).not.toHaveBeenCalled();
			expect(listButton).toHaveAttribute("data-state", "on");
			expect(gridButton).toHaveAttribute("data-state", "off");
		});

		it("should not allow empty selection state", async () => {
			const user = userEvent.setup();
			const onValueChange = vi.fn();

			render(
				<ViewSwitcher defaultValue="grid" onValueChange={onValueChange} />,
			);

			const gridButton = screen.getByTestId("view-switcher-grid");

			expect(gridButton).toHaveAttribute("data-state", "on");

			await user.click(gridButton);

			expect(onValueChange).not.toHaveBeenCalled();

			expect(gridButton).toHaveAttribute("data-state", "on");
		});

		it("should always have at least one option selected", async () => {
			const user = userEvent.setup();

			render(<ViewSwitcher />);

			const listButton = screen.getByTestId("view-switcher-list");
			const gridButton = screen.getByTestId("view-switcher-grid");

			await user.click(listButton);
			await user.click(listButton);
			await user.click(listButton);

			const isListSelected = listButton.getAttribute("data-state") === "on";
			const isGridSelected = gridButton.getAttribute("data-state") === "on";

			expect(isListSelected || isGridSelected).toBe(true);
			expect(isListSelected).toBe(true);
		});
	});
});
