import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { DataPanel } from "~/components/DataPanel";
import { DateModal } from "~/components/DateModal";
import { DisclaimerModal } from "~/components/DisclaimerModal";
import { EventList } from "~/components/EventList";
import { Header } from "~/components/Header";
import { Key } from "~/components/Key";
import { Latamap } from "~/components/Latamap";
import { Sidebar } from "~/components/Sidebar";
import { Timeline } from "~/components/Timeline";
import { fetchData } from "~/data/fetchData";
import { useMapStore } from "~/data/store";

export const Route = createFileRoute("/")({
	loader: () => fetchData(),
	component: App,
});

function App() {
	const { leaders, lastUpdated, mostRecentLeader } = Route.useLoaderData();
	const { setLeaders } = useMapStore();

	// leaders dates became strings instead of dates, so we need to convert them back to dates
	const newLeaders = leaders.map((x) => {
		return {
			...x,
			tookOffice: new Date(x.tookOffice),
			leftOffice: x.leftOffice ? new Date(x.leftOffice) : null,
			createdAt: new Date(x.createdAt),
			Country: {
				...x.Country,
				createdAt: new Date(x.Country.createdAt),
			},
		};
	});

	useEffect(() => {
		setLeaders(newLeaders);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="flex h-screen flex-col items-center bg-radial-[at_bottom_right] from-red-100 via-orange-100 to-blue-100">
				<Header />
				<main className="flex min-h-0 w-full max-w-3xl flex-1 flex-col items-center justify-center">
					<div className="relative h-content w-full">
						<Latamap />
						<DataPanel />
						<Key />
					</div>
					<Timeline />
				</main>
				<EventList />
				<Sidebar
					lastUpdated={new Date(lastUpdated)}
					mostRecentLeader={mostRecentLeader}
				/>
			</div>
			<DateModal />
			<DisclaimerModal />
		</>
	);
}
