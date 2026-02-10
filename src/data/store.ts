import { create } from "zustand";

import type { LeaderReturn } from "~/data/types";

type MapState = {
	leaders: LeaderReturn[];
	setLeaders: (by: LeaderReturn[]) => void;
	date: Date;
	setDate: (by: Date) => void;
	selectedCountry: string | undefined;
	setSelectedCountry: (by: string | undefined) => void;
};

export const useMapStore = create<MapState>((set) => ({
	leaders: [],
	setLeaders: (by) => set({ leaders: by }),
	date: new Date(),
	setDate: (by) => set(() => ({ date: by })),
	selectedCountry: `United States of America`,
	setSelectedCountry: (by) => set(() => ({ selectedCountry: by })),
}));
