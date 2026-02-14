import { describe, expect, it } from "vitest";
import { occupancyStore } from "@/store/occupancyStore";

describe("occupancyStore", () => {
	it("should initialize with default values", () => {
		const state = occupancyStore.getState();
		expect(state.view).toBe("list");
	});

	it("should set view and update state", () => {
		occupancyStore.getState().setView("list");
		expect(occupancyStore.getState().view).toEqual("list");

		occupancyStore.getState().setView("grid");
		expect(occupancyStore.getState().view).toEqual("grid");
	});
});
