import type { LeaderReturn } from "~/data/types";

export function createMockLeader(
	overrides: Partial<LeaderReturn> = {},
): LeaderReturn {
	return {
		name: `Leader`,
		party: "Test Party",
		leaning: 4,
		tookOffice: new Date(2000, 0, 1),
		leftOffice: new Date(2004, 0, 1),
		Country: { name: "Test Country" },
		...overrides,
	};
}
