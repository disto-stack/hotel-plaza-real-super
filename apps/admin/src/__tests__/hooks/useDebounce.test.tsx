import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should return initial value immediately", () => {
		const { result } = renderHook(() => useDebounce("hello", 300));
		expect(result.current).toBe("hello");
	});

	it("should debounce value update after specified delay", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, 300),
			{ initialProps: { value: "hello" } },
		);

		expect(result.current).toBe("hello");

		rerender({ value: "world" });

		expect(result.current).toBe("hello");

		act(() => {
			vi.advanceTimersByTime(150);
		});
		expect(result.current).toBe("hello");

		act(() => {
			vi.advanceTimersByTime(150);
		});
		expect(result.current).toBe("world");
	});

	it("should cancel pending timeout if value changes again before delay completes", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, 300),
			{ initialProps: { value: "hello" } },
		);

		expect(result.current).toBe("hello");

		rerender({ value: "world" });
		expect(result.current).toBe("hello");

		act(() => {
			vi.advanceTimersByTime(150);
		});
		expect(result.current).toBe("hello");

		rerender({ value: "everyone" });
		expect(result.current).toBe("hello");

		act(() => {
			vi.advanceTimersByTime(150);
		});
		expect(result.current).toBe("hello");

		act(() => {
			vi.advanceTimersByTime(150);
		});
		expect(result.current).toBe("everyone");
	});
});
