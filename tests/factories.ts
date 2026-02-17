import type { LeaderReturn, CountryReturn } from "~/data/types";

let nextId = 1;

export function createMockCountry(
	overrides: Partial<CountryReturn> = {},
): CountryReturn {
	const id = nextId++;
	return {
		id,
		name: `Country ${id}`,
		createdAt: new Date(),
		...overrides,
	};
}

export function createMockLeader(
	overrides: Partial<LeaderReturn> & { Country?: Partial<CountryReturn> } = {},
): LeaderReturn {
	const id = nextId++;
	const country = createMockCountry(overrides.Country);
	return {
		id,
		countryId: country.id,
		name: `Leader ${id}`,
		party: "Test Party",
		leaning: 4,
		tookOffice: new Date(2000, 0, 1),
		leftOffice: new Date(2004, 0, 1),
		createdAt: new Date(),
		Country: country,
		...overrides,
		...(overrides.Country ? { Country: country } : {}),
	};
}
