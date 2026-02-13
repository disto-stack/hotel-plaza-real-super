import { create } from "zustand";

interface OccupancyState {
	view: "list" | "grid";
	setView: (view: "list" | "grid") => void;
}

export const occupancyStore = create<OccupancyState>()((set) => ({
	view: "list",
	setView: (view) => set({ view }),
}));
