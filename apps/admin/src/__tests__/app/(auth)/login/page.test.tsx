import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoginPage from "@/app/(auth)/login/page";

describe("Login Page", () => {
	it("should render without crashing", () => {
		render(<LoginPage />);
		expect(screen.getByTestId("login-form")).toBeInTheDocument();
	});
});
