import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OccupationsGuestsCollapsible } from "@/components/dashboard/occupations/OccupationsGuestsCollapsible";
import type { Occupation } from "@/lib/types/occupation.types";

describe("OccupationGuestsCollapsible", () => {
	it("renders the guests", () => {
		const occupation = {
			id: "1",
			room: {
				id: "1",
				roomNumber: "101",
				roomType: "standard",
			},
			guests: [
				{
					id: "1",
					isPrimary: true,
					guest: {
						id: "1",
						firstName: "John",
						lastName: "Doe",
						documentNumber: "123456789",
						email: "[EMAIL_ADDRESS]",
						phone: "123456789",
					},
				},
				{
					id: "2",
					isPrimary: false,
					guest: {
						id: "2",
						firstName: "Jane",
						lastName: "Doe",
						documentNumber: "123456789",
						email: "[EMAIL_ADDRESS]",
						phone: "123456789",
					},
				},
			],
			checkInDatetime: "2022-01-01T12:00:00",
			checkOutDatetime: "2022-01-02T12:00:00",
			status: "checked_in",
			totalPrice: 100,
			createdAt: "2022-01-01T12:00:00",
			updatedAt: "2022-01-01T12:00:00",
		} as unknown as Occupation;

		const { getByText } = render(
			<OccupationsGuestsCollapsible occupation={occupation} />,
		);

		expect(getByText("John Doe")).toBeInTheDocument();
		expect(getByText("Jane Doe")).toBeInTheDocument();
	});
});
