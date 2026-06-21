import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchableSearchBar } from "@/components/ui/SearchableSearchBar";

describe("SearchableSearchBar", () => {
	const mockOnChange = vi.fn();
	const mockOnSelect = vi.fn();
	const mockOnLoadMore = vi.fn();

	const mockResults = [
		{ id: "1", name: "Result One" },
		{ id: "2", name: "Result Two" },
	];

	it("should render placeholder and input search bar", () => {
		render(
			<SearchableSearchBar
				placeholder="Search something..."
				value=""
				onChange={mockOnChange}
				onSelect={mockOnSelect}
				results={[]}
				renderItem={(item) => <span>{item.name}</span>}
				data-testid="search"
			/>,
		);

		const input = screen.getByTestId("search-input");
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("placeholder", "Search something...");
	});

	it("should trigger onChange when user types", async () => {
		const user = userEvent.setup();
		render(
			<SearchableSearchBar
				value=""
				onChange={mockOnChange}
				onSelect={mockOnSelect}
				results={[]}
				renderItem={(item) => <span>{item.name}</span>}
				data-testid="search"
			/>,
		);

		const input = screen.getByTestId("search-input");
		await user.type(input, "Hello");

		expect(mockOnChange).toHaveBeenCalled();
	});

	it("should display results list and trigger onSelect when item clicked", async () => {
		const user = userEvent.setup();
		render(
			<SearchableSearchBar
				value="Result"
				onChange={mockOnChange}
				onSelect={mockOnSelect}
				results={mockResults}
				renderItem={(item) => <span>{item.name}</span>}
				data-testid="search"
			/>,
		);

		const input = screen.getByTestId("search-input");
		await user.click(input);

		const list = screen.getByTestId("search-results");
		expect(list).toBeInTheDocument();

		const firstResult = screen.getByTestId("search-result-0");
		expect(firstResult).toHaveTextContent("Result One");

		await user.click(firstResult);
		expect(mockOnSelect).toHaveBeenCalledWith(mockResults[0]);
	});

	it("should show loading indicator when isLoading is true", async () => {
		const user = userEvent.setup();
		render(
			<SearchableSearchBar
				value="Result"
				onChange={mockOnChange}
				onSelect={mockOnSelect}
				isLoading={true}
				results={[]}
				renderItem={(item) => <span>{item.name}</span>}
				data-testid="search"
			/>,
		);

		const input = screen.getByTestId("search-input");
		await user.click(input);

		expect(screen.getByText(/buscando.../i)).toBeInTheDocument();
	});

	it("should render Load More button and trigger onLoadMore when clicked", async () => {
		const user = userEvent.setup();
		render(
			<SearchableSearchBar
				value="Result"
				onChange={mockOnChange}
				onSelect={mockOnSelect}
				results={mockResults}
				renderItem={(item) => <span>{item.name}</span>}
				hasMore={true}
				onLoadMore={mockOnLoadMore}
				data-testid="search"
			/>,
		);

		const input = screen.getByTestId("search-input");
		await user.click(input);

		const loadMoreButton = screen.getByTestId("search-load-more");
		expect(loadMoreButton).toBeInTheDocument();

		await user.click(loadMoreButton);
		expect(mockOnLoadMore).toHaveBeenCalled();
	});
});
