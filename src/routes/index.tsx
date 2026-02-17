import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { DataPanel } from "~/components/DataPanel";
import { DateModal } from "~/components/DateModal";
import { DisclaimerModal } from "~/components/DisclaimerModal";
import { EventList } from "~/components/EventList";
import { FeedbackModal } from "~/components/FeedbackModal";
import { Header } from "~/components/Header";
import { Key } from "~/components/Key";
import { Latamap } from "~/components/Latamap";
import { Sidebar } from "~/components/Sidebar";
import { Timeline } from "~/components/Timeline";
import { fetchData } from "~/data/fetchData";
import { countryNames } from "~/data/map";
import { formatDateParam, parseDateParam } from "~/utils/date";
export { formatDateParam, parseDateParam };

const searchDefaults = {
	menu: false,
	timeline: false,
	key: true,
	panel: true,
	dateModal: false,
	disclaimerModal: false,
	feedbackModal: false,
	scheme: "default" as const,
	date: formatDateParam(new Date()),
	country: "United States of America",
};

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>) => ({
		menu: search.menu === true,
		timeline: search.timeline === true,
		key: search.key !== false,
		panel: search.panel !== false,
		dateModal: search.dateModal === true,
		disclaimerModal: search.disclaimerModal === true,
		feedbackModal: search.feedbackModal === true,
		scheme: (search.scheme === "inverted" ? "inverted" : "default") as
			| "default"
			| "inverted",
		date:
			typeof search.date === "string"
				? search.date
				: formatDateParam(new Date()),
		country:
			typeof search.country === "string" && countryNames.has(search.country)
				? search.country
				: "United States of America",
	}),
	search: {
		middlewares: [stripSearchParams(searchDefaults)],
	},
	loader: () => fetchData(),
	component: App,
});

function App() {
	const { lastUpdated, mostRecentLeader } = Route.useLoaderData();

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
			<FeedbackModal />
			<SpeedInsights />
		</>
	);
}
