import { create } from "zustand";

type MapState = {
	date: Date;
	setDate: (by: Date) => void;
	selectedCountry: string | undefined;
	setSelectedCountry: (by: string | undefined) => void;
};

export const useMapStore = create<MapState>((set) => ({
	date: new Date(),
	setDate: (by) => set(() => ({ date: by })),
	selectedCountry: `United States of America`,
	setSelectedCountry: (by) => set(() => ({ selectedCountry: by })),
}));
