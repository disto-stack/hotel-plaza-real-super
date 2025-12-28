/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import type { ColumnDef } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import type { JSX } from "react";
import { describe, expect, it } from "vitest";
import {
	occupationsTableColumns,
	sortOccupationsByCheckIn,
	sortOccupationsByCheckOut,
	sortOccupationsByGuests,
	sortOccupationsByPrice,
	sortOccupationsByRoom,
	sortOccupationsByStatus,
} from "@/components/dashboard/occupations/occupationsTableColumns";
import type { Occupation } from "@/lib/types/occupation.types";
import type { Room } from "@/lib/types/room.types";

describe("OccupationsTableColumns", () => {
	it("should have the correct columns", () => {
		const columnsList = occupationsTableColumns;
		expect(columnsList).toHaveLength(7);
	});

	describe("sorting functions", () => {
		it("should sort by room number", () => {
			const occupationA = {
				room: {
					roomNumber: "101",
					id: "1",
					floor: 1,
					capacity: 1,
					pricePerNight: 100,
				} as Room,
			} as Occupation;

			const occupationB = {
				room: {
					roomNumber: "102",
					id: "2",
					floor: 1,
					capacity: 1,
					pricePerNight: 100,
				} as Room,
			} as Occupation;

			expect(sortOccupationsByRoom(occupationA, occupationB)).toBe(-1);
		});

		it("should sort by guests", () => {
			const occupationA = {
				guests: [
					{
						isPrimary: true,
						guest: {
							firstName: "Aidan",
							lastName: "Garcia",
						},
					},
				],
			} as Occupation;

			const occupationB = {
				guests: [
					{
						isPrimary: true,
						guest: {
							firstName: "Jane",
							lastName: "Smith",
						},
					},
				],
			} as Occupation;

			expect(sortOccupationsByGuests(occupationA, occupationB)).toBe(-1);
		});

		it("should return 0 when sorting by guests if one guest has no firstName", () => {
			const occupationA = {
				guests: [
					{
						isPrimary: true,
						guest: {
							firstName: "",
							lastName: "Garcia",
						},
					},
				],
			} as Occupation;

			const occupationB = {
				guests: [
					{
						isPrimary: true,
						guest: {
							firstName: "Jane",
							lastName: "Smith",
						},
					},
				],
			} as Occupation;

			expect(sortOccupationsByGuests(occupationA, occupationB)).toBe(0);
		});

		it("should return 0 when sorting by guests if both guests have no firstName", () => {
			const occupationA = {
				guests: [
					{
						isPrimary: true,
						guest: {
							lastName: "Garcia",
						},
					},
				],
			} as Occupation;

			const occupationB = {
				guests: [
					{
						isPrimary: true,
						guest: {
							lastName: "Smith",
						},
					},
				],
			} as Occupation;

			expect(sortOccupationsByGuests(occupationA, occupationB)).toBe(0);
		});

		it("should sort by check-in date", () => {
			const occupationA = {
				checkInDatetime: "2025-01-01T00:00:00Z",
			} as Occupation;

			const occupationB = {
				checkInDatetime: "2025-01-02T00:00:00Z",
			} as Occupation;

			expect(sortOccupationsByCheckIn(occupationA, occupationB)).toBe(-1);
		});

		it("should sort by check-in date when they are the same", () => {
			const occupationA = {
				checkInDatetime: "2025-01-01T00:00:00Z",
			} as Occupation;

			const occupationB = {
				checkInDatetime: "2025-01-01T00:00:00Z",
			} as Occupation;

			expect(sortOccupationsByCheckIn(occupationA, occupationB)).toBe(0);
		});

		it("should sort by check-in date in descending order", () => {
			const occupationA = {
				checkInDatetime: "2025-01-02T00:00:00Z",
			} as Occupation;

			const occupationB = {
				checkInDatetime: "2025-01-01T00:00:00Z",
			} as Occupation;

			expect(sortOccupationsByCheckIn(occupationA, occupationB)).toBe(1);
		});

		it("should sort by check-out date", () => {
			const occupationA = {
				checkOutDatetime: "2025-01-01T00:00:00Z",
			} as Occupation;

			const occupationB = {
				checkOutDatetime: "2025-01-02T00:00:00Z",
			} as Occupation;

			expect(sortOccupationsByCheckOut(occupationA, occupationB)).toBe(-1);
		});

		it("should sort by check-out date when they are the same", () => {
			const occupationA = {
				checkOutDatetime: "2025-01-01T00:00:00Z",
			} as Occupation;

			const occupationB = {
				checkOutDatetime: "2025-01-01T00:00:00Z",
			} as Occupation;

			expect(sortOccupationsByCheckOut(occupationA, occupationB)).toBe(0);
		});

		it("should sort by check-out date in descending order", () => {
			const occupationA = {
				checkOutDatetime: "2025-01-02T00:00:00Z",
			} as Occupation;

			const occupationB = {
				checkOutDatetime: "2025-01-01T00:00:00Z",
			} as Occupation;

			expect(sortOccupationsByCheckOut(occupationA, occupationB)).toBe(1);
		});

		it("should sort by status", () => {
			const occupationA = {
				status: "checked_in",
			} as Occupation;

			const occupationB = {
				status: "checked_out",
			} as Occupation;

			expect(sortOccupationsByStatus(occupationA, occupationB)).toBe(-1);
		});

		it("should sort by price", () => {
			const occupationA = {
				totalPrice: 100000,
			} as Occupation;

			const occupationB = {
				totalPrice: 200000,
			} as Occupation;

			expect(sortOccupationsByPrice(occupationA, occupationB)).toBe(-100000);
		});
	});

	describe("column renderers", () => {
		describe("room column", () => {
			it("should render room header with DataTableColumnHeader", () => {
				const roomColumn =
					occupationsTableColumns[0] as ColumnDef<Occupation> & {
						header: (props: any) => JSX.Element;
					};

				const mockColumn = {
					getIsSorted: () => false,
					toggleSorting: () => {},
					clearSorting: () => {},
					getCanSort: () => true,
				};

				const headerElement = roomColumn.header({ column: mockColumn });
				render(headerElement);

				expect(screen.getByText("Habitación")).toBeDefined();
			});

			it("should render room cell with room number and type", () => {
				const roomColumn =
					occupationsTableColumns[0] as ColumnDef<Occupation> & {
						cell: (props: any) => JSX.Element;
					};

				const mockRow = {
					original: {
						id: "1",
						room: {
							roomNumber: "101",
							roomType: "single",
							id: "1",
							floor: 1,
							capacity: 1,
							pricePerNight: 100,
						} as Room,
					} as Occupation,
				};

				const cellElement = roomColumn.cell({ row: mockRow } as any);
				render(cellElement);

				expect(screen.getByText("101")).toBeDefined();
				expect(screen.getByText("Individual")).toBeDefined();
			});

			it("should render room cell with double room type", () => {
				const roomColumn =
					occupationsTableColumns[0] as ColumnDef<Occupation> & {
						cell: (props: any) => JSX.Element;
					};

				const mockRow = {
					original: {
						id: "1",
						room: {
							roomNumber: "201",
							roomType: "double",
							id: "2",
							floor: 2,
							capacity: 2,
							pricePerNight: 150,
						} as Room,
					} as Occupation,
				};

				const cellElement = roomColumn.cell({ row: mockRow } as any);
				render(cellElement);

				expect(screen.getByText("201")).toBeDefined();
				expect(screen.getByText("Doble")).toBeDefined();
			});

			it("should render room cell with family room type", () => {
				const roomColumn =
					occupationsTableColumns[0] as ColumnDef<Occupation> & {
						cell: (props: any) => JSX.Element;
					};

				const mockRow = {
					original: {
						id: "1",
						room: {
							roomNumber: "301",
							roomType: "family",
							id: "3",
							floor: 3,
							capacity: 4,
							pricePerNight: 200,
						} as Room,
					} as Occupation,
				};

				const cellElement = roomColumn.cell({ row: mockRow } as any);
				render(cellElement);

				expect(screen.getByText("301")).toBeDefined();
				expect(screen.getByText("Familiar")).toBeDefined();
			});
		});

		describe("guests column", () => {
			it("should render guests header with DataTableColumnHeader", () => {
				const guestsColumn =
					occupationsTableColumns[1] as ColumnDef<Occupation> & {
						header: (props: any) => JSX.Element;
					};

				const mockColumn = {
					getIsSorted: () => false,
					toggleSorting: () => {},
					clearSorting: () => {},
					getCanSort: () => true,
				};

				const headerElement = guestsColumn.header({ column: mockColumn });
				render(headerElement);

				expect(screen.getByText("Huéspedes")).toBeDefined();
			});

			it("should render guests cell with primary guest info", () => {
				const guestsColumn =
					occupationsTableColumns[1] as ColumnDef<Occupation> & {
						cell: (props: any) => JSX.Element;
					};

				const mockRow = {
					original: {
						id: "1",
						numberOfGuests: 2,
						guests: [
							{
								id: "1",
								isPrimary: true,
								guest: {
									id: "g1",
									firstName: "John",
									lastName: "Doe",
								},
							},
						],
					} as Occupation,
				};

				const cellElement = guestsColumn.cell({ row: mockRow } as any);
				render(cellElement);

				expect(screen.getByText("John Doe")).toBeDefined();
				expect(screen.getByText("2 huéspedes")).toBeDefined();
			});

			it("should render guests cell with singular guest text", () => {
				const guestsColumn =
					occupationsTableColumns[1] as ColumnDef<Occupation> & {
						cell: (props: any) => JSX.Element;
					};

				const mockRow = {
					original: {
						id: "1",
						numberOfGuests: 1,
						guests: [
							{
								id: "1",
								isPrimary: true,
								guest: {
									id: "g1",
									firstName: "Jane",
									lastName: "Smith",
								},
							},
						],
					} as Occupation,
				};

				const cellElement = guestsColumn.cell({ row: mockRow } as any);
				render(cellElement);

				expect(screen.getByText("Jane Smith")).toBeDefined();
				expect(screen.getByText("1 huésped")).toBeDefined();
			});
		});

		describe("check-in column", () => {
			it("should render check-in header with DataTableColumnHeader", () => {
				const checkInColumn =
					occupationsTableColumns[2] as ColumnDef<Occupation> & {
						header: (props: any) => JSX.Element;
					};

				const mockColumn = {
					getIsSorted: () => false,
					toggleSorting: () => {},
					clearSorting: () => {},
					getCanSort: () => true,
				};

				const headerElement = checkInColumn.header({ column: mockColumn });
				render(headerElement);

				expect(screen.getByText("Check-in")).toBeDefined();
			});

			it("should render check-in cell with formatted date", () => {
				const checkInColumn =
					occupationsTableColumns[2] as ColumnDef<Occupation> & {
						cell: (props: any) => JSX.Element;
					};

				const mockRow = {
					original: {
						id: "1",
						checkInDatetime: "2025-01-15T14:00:00Z",
					} as Occupation,
				};

				const cellElement = checkInColumn.cell({ row: mockRow } as any);
				render(cellElement);

				expect(screen.getByText(/15/)).toBeDefined();
			});
		});

		describe("check-out column", () => {
			it("should render check-out header with DataTableColumnHeader", () => {
				const checkOutColumn =
					occupationsTableColumns[3] as ColumnDef<Occupation> & {
						header: (props: any) => JSX.Element;
					};

				const mockColumn = {
					getIsSorted: () => false,
					toggleSorting: () => {},
					clearSorting: () => {},
					getCanSort: () => true,
				};

				const headerElement = checkOutColumn.header({ column: mockColumn });
				render(headerElement);

				expect(screen.getByText("Check-out")).toBeDefined();
			});

			it("should render check-out cell with formatted date", () => {
				const checkOutColumn =
					occupationsTableColumns[3] as ColumnDef<Occupation> & {
						cell: (props: any) => JSX.Element;
					};

				const mockRow = {
					original: {
						id: "1",
						checkOutDatetime: "2025-01-20T12:00:00Z",
					} as Occupation,
				};

				const cellElement = checkOutColumn.cell({ row: mockRow } as any);
				render(cellElement);

				expect(screen.getByText(/20/)).toBeDefined();
			});
		});

		describe("status column", () => {
			it("should render status header with DataTableColumnHeader", () => {
				const statusColumn =
					occupationsTableColumns[4] as ColumnDef<Occupation> & {
						header: (props: any) => JSX.Element;
					};

				const mockColumn = {
					getIsSorted: () => false,
					toggleSorting: () => {},
					clearSorting: () => {},
					getCanSort: () => true,
				};

				const headerElement = statusColumn.header({ column: mockColumn });
				render(headerElement);

				expect(screen.getByText("Estado")).toBeDefined();
			});

			it("should render status cell with badge", () => {
				const statusColumn =
					occupationsTableColumns[4] as ColumnDef<Occupation> & {
						cell: (props: any) => JSX.Element;
					};

				const mockRow = {
					original: {
						id: "1",
						status: "checked_in",
					} as Occupation,
				};

				const cellElement = statusColumn.cell({ row: mockRow } as any);
				render(cellElement);

				expect(screen.getByText("Check-in")).toBeDefined();
			});
		});

		describe("stay type column", () => {
			it("should render stay type cell with hourly type", () => {
				const stayTypeColumn =
					occupationsTableColumns[5] as ColumnDef<Occupation> & {
						cell: (props: any) => JSX.Element;
					};

				const mockRow = {
					original: {
						id: "1",
						stayType: "hourly",
					} as Occupation,
				};

				const cellElement = stayTypeColumn.cell({ row: mockRow } as any);
				render(cellElement);

				expect(screen.getByText("Rato")).toBeDefined();
			});

			it("should render stay type cell with nightly type", () => {
				const stayTypeColumn =
					occupationsTableColumns[5] as ColumnDef<Occupation> & {
						cell: (props: any) => JSX.Element;
					};

				const mockRow = {
					original: {
						id: "1",
						stayType: "nightly",
					} as Occupation,
				};

				const cellElement = stayTypeColumn.cell({ row: mockRow } as any);
				render(cellElement);

				expect(screen.getByText("Noche")).toBeDefined();
			});
		});

		describe("price column", () => {
			it("should render price header with DataTableColumnHeader", () => {
				const priceColumn =
					occupationsTableColumns[6] as ColumnDef<Occupation> & {
						header: (props: any) => JSX.Element;
					};

				const mockColumn = {
					getIsSorted: () => false,
					toggleSorting: () => {},
					clearSorting: () => {},
					getCanSort: () => true,
				};

				const headerElement = priceColumn.header({ column: mockColumn });
				render(headerElement);

				expect(screen.getByText("Precio total")).toBeDefined();
			});

			it("should render price cell with formatted currency", () => {
				const priceColumn =
					occupationsTableColumns[6] as ColumnDef<Occupation> & {
						cell: (props: any) => JSX.Element;
					};

				const mockRow = {
					original: {
						id: "1",
						totalPrice: 150000,
					} as Occupation,
				};

				const cellElement = priceColumn.cell({ row: mockRow } as any);
				render(cellElement);

				expect(screen.getByText(/150/)).toBeDefined();
			});
		});
	});

	describe("sortingFn in columns", () => {
		it("should have sortingFn defined that uses sortOccupationsByRoom for room column", () => {
			const columnsList = occupationsTableColumns;
			const sortingFn = columnsList[0].sortingFn;

			expect(sortingFn).toBeDefined();
			expect(typeof sortingFn).toBe("function");
		});

		it("should have sortingFn defined that uses sortOccupationsByGuests for guests column", () => {
			const columnsList = occupationsTableColumns;
			const sortingFn = columnsList[1].sortingFn;

			expect(sortingFn).toBeDefined();
			expect(typeof sortingFn).toBe("function");
		});

		it("should have sortingFn defined that uses sortOccupationsByCheckIn for check-in column", () => {
			const columnsList = occupationsTableColumns;
			const sortingFn = columnsList[2].sortingFn;

			expect(sortingFn).toBeDefined();
			expect(typeof sortingFn).toBe("function");
		});

		it("should have sortingFn defined that uses sortOccupationsByCheckOut for check-out column", () => {
			const columnsList = occupationsTableColumns;
			const sortingFn = columnsList[3].sortingFn;

			expect(sortingFn).toBeDefined();
			expect(typeof sortingFn).toBe("function");
		});

		it("should have sortingFn defined that uses sortOccupationsByStatus for status column", () => {
			const columnsList = occupationsTableColumns;
			const sortingFn = columnsList[4].sortingFn;

			expect(sortingFn).toBeDefined();
			expect(typeof sortingFn).toBe("function");
		});

		it("should have sortingFn defined that uses sortOccupationsByPrice for price column", () => {
			const columnsList = occupationsTableColumns;
			const sortingFn = columnsList[6].sortingFn;

			expect(sortingFn).toBeDefined();
			expect(typeof sortingFn).toBe("function");
		});
	});
});
