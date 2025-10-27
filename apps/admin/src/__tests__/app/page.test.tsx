import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

vi.mock("next/navigation", () => ({
	redirect: vi.fn(),
}));

describe("Home Page", () => {
	it("should call redirect to /guests", () => {
		Home();

		expect(redirect).toHaveBeenCalledWith("/guests");
		expect(redirect).toHaveBeenCalledTimes(1);
	});
});
