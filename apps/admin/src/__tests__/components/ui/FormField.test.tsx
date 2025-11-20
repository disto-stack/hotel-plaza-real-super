import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";

describe("FormField", () => {
	it("should render without crashing", () => {
		render(
			<FormField label="Email">
				<Input />
			</FormField>,
		);
		expect(screen.getByText("Email")).toBeInTheDocument();
	});

	it("should show required asterisk when required is true", () => {
		render(
			<FormField label="Email" required>
				<Input />
			</FormField>,
		);
		expect(screen.getByText("*")).toBeInTheDocument();
	});

	it("should generate id from label when htmlFor is not provided", () => {
		render(
			<FormField label="Email Address">
				<Input />
			</FormField>,
		);
		const input = screen.getByRole("textbox");
		expect(input).toHaveAttribute("id", "field-email-address");
	});

	it("should use htmlFor as id when provided", () => {
		render(
			<FormField label="Email" htmlFor="custom-id">
				<Input />
			</FormField>,
		);
		const input = screen.getByRole("textbox");
		expect(input).toHaveAttribute("id", "custom-id");
	});

	it("should display error message when error is provided", () => {
		render(
			<FormField label="Email" error="Email is required">
				<Input />
			</FormField>,
		);
		expect(screen.getByText("Email is required")).toBeInTheDocument();
		expect(screen.getByText("Email is required")).toHaveAttribute(
			"role",
			"alert",
		);
	});

	it("should set aria-invalid when error is provided", () => {
		render(
			<FormField label="Email" error="Email is required">
				<Input />
			</FormField>,
		);
		const input = screen.getByRole("textbox");
		expect(input).toHaveAttribute("aria-invalid", "true");
	});
});
