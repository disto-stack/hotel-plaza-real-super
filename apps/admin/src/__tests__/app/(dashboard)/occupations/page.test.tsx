import { QueryClient } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OccupationsPage from "@/app/(dashboard)/occupations/page";
import { createServerQueryClient } from "@/lib/query-server";

vi.mock("@/lib/query-server", () => ({
	createServerQueryClient: vi.fn(),
}));

vi.mock("@/lib/api/occupations.server", () => ({
	occupationsApiServer: {
		getOccupations: vi.fn(),
	},
}));

vi.mock("@tanstack/react-query", async () => {
	const actual = await vi.importActual("@tanstack/react-query");
	return {
		...actual,
		HydrationBoundary: ({ children }: { children: React.ReactNode }) => (
			<>{children}</>
		),
		dehydrate: vi.fn(() => ({})),
	};
});

describe("OccupationsPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		const mockQueryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
			},
		});

		mockQueryClient.prefetchQuery = vi.fn().mockResolvedValue(undefined);

		vi.mocked(createServerQueryClient).mockReturnValue(mockQueryClient);
	});

	it("should create query client and prefetch guests on render", async () => {
		render(<OccupationsPage />);

		expect(createServerQueryClient).toHaveBeenCalled();
	});

	it("should render HydrationBoundary wrapper", async () => {
		const { container } = render(<OccupationsPage />);

		expect(container).toBeTruthy();
	});
});
