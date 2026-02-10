import { createServerFn } from "@tanstack/react-start";
import { prisma } from "~/db";

export const fetchData = createServerFn({
	method: "GET",
}).handler(async () => {
	const leaders = await prisma.leader.findMany({ include: { Country: true } });
	const mostRecentUpdate = await prisma.leader.findFirst({
		orderBy: { createdAt: `desc` },
		select: { createdAt: true },
	});
	const newestLeader = await prisma.leader.findFirst({
		where: { tookOffice: { lte: new Date() } },
		orderBy: { tookOffice: `desc` },
		select: { name: true, tookOffice: true, Country: { select: { name: true } } },
	});

	const data = {
		leaders,
		lastUpdated: mostRecentUpdate?.createdAt ?? new Date(),
		mostRecentLeader: newestLeader,
	};

	if (!data) throw new Error("No data found");
	return data;
});
