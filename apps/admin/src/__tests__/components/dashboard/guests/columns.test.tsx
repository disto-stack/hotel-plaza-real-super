import { describe, expect, it } from "vitest";
import { columns } from "@/components/dashboard/guests/columns";

describe("GuestsColumns", () => {
	it("should have the correct columns", () => {
		const columnsList = columns;
		expect(columnsList).toHaveLength(5);
		expect(columnsList[0].header).toBe("Nombres");
		expect(columnsList[1].header).toBe("Apellidos");
		expect(columnsList[2].header).toBe("Ocupación");
		expect(columnsList[3].header).toBe("Teléfono");
		expect(columnsList[4].header).toBe("Número de documento");
	});
});
