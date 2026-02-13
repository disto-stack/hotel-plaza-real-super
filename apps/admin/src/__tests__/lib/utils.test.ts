import { format } from "date-fns/format";
import { es } from "date-fns/locale";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { formatDateTime } from "@/lib/utils";

vi.mock("date-fns/format", () => ({
	format: vi.fn().mockReturnValue("2021-01-01"),
}));

describe("utils", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should format a date", () => {
		const dateString = "2021-01-01";

		formatDateTime(dateString);
		expect(format).toHaveBeenCalledWith(
			dateString,
			"EEEE, MMMM dd, yyyy, hh:mm a",
			{ locale: es },
		);
	});
});
