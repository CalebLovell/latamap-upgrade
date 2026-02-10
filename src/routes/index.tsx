import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
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

const searchDefaults = {
	menu: false,
	timeline: false,
	key: true,
	panel: true,
	dateModal: false,
	disclaimerModal: false,
	scheme: "default" as const,
};

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>) => ({
		menu: search.menu === true,
		timeline: search.timeline === true,
		key: search.key !== false,
		panel: search.panel !== false,
		dateModal: search.dateModal === true,
		disclaimerModal: search.disclaimerModal === true,
		scheme: (search.scheme === "inverted" ? "inverted" : "default") as
			| "default"
			| "inverted",
	}),
	search: {
		middlewares: [stripSearchParams(searchDefaults)],
	},
	loader: () => fetchData(),
	component: App,
});

function App() {
	const { leaders, lastUpdated, mostRecentLeader } = Route.useLoaderData();
	const { setLeaders } = useMapStore();

	useEffect(() => {
		setLeaders(leaders);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="flex h-screen flex-col items-center bg-radial-[at_bottom_right] from-red-100 via-orange-100 to-blue-100">
				<Header />
				<main className="flex min-h-0 w-full max-w-3xl flex-1 flex-col items-center">
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
