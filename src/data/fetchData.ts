import { createServerFn } from "@tanstack/react-start";
import { prisma } from "~/db";

export const fetchData = createServerFn({
	method: "GET",
}).handler(async () => {
	const [leaders, mostRecentUpdate, newestLeader] = await Promise.all([
		prisma.leader.findMany({
			select: {
				name: true,
				party: true,
				leaning: true,
				tookOffice: true,
				leftOffice: true,
				Country: { select: { name: true } },
			},
		}),
		prisma.leader.findFirst({
			orderBy: { createdAt: `desc` },
			select: { createdAt: true },
		}),
		prisma.leader.findFirst({
			where: { tookOffice: { lte: new Date() } },
			orderBy: { tookOffice: `desc` },
			select: {
				name: true,
				tookOffice: true,
				Country: { select: { name: true } },
			},
		}),
	]);

	return {
		leaders,
		lastUpdated: mostRecentUpdate?.createdAt ?? new Date(),
		mostRecentLeader: newestLeader,
	};
});
