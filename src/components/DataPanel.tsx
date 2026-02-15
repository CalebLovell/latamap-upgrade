import {
	AcademicCapIcon,
	ClockIcon,
	LightBulbIcon,
	UserCircleIcon,
} from "@heroicons/react/24/solid";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { useRef } from "react";
import Draggable from "react-draggable";
import { getLeadersByDate, leaningLabels } from "~/data/types";
import { formatDateParam, parseDateParam } from "~/routes/index";

const route = getRouteApi("/");

const formatDate = (date: Date | undefined) =>
	date ? format(new Date(date), `MMM d, yyy`) : undefined;

export const DataPanel = () => {
	const nodeRef = useRef<HTMLDivElement>(null);
	const {
		panel,
		date: dateParam,
		country: selectedCountry,
	} = route.useSearch();
	const navigate = useNavigate();
	const { leaders } = route.useLoaderData();
	const date = parseDateParam(dateParam);
	const leadersByDate = getLeadersByDate(leaders, date);
	const leader = leadersByDate?.find((x) => x.Country.name === selectedCountry);

	const country = selectedCountry ? selectedCountry : `Select a Country`;
	const name = leader?.name ? leader?.name : `-`;
	const party = leader?.party ? leader?.party : `-`;
	const leaning =
		leader?.leaning != null
			? leaningLabels[leader.leaning as keyof typeof leaningLabels]
			: `-`;
	const inOffice = `${leader?.tookOffice ? formatDate(leader?.tookOffice) : ``} - ${
		leader?.leftOffice
			? formatDate(leader?.leftOffice)
			: leader?.leftOffice === null
				? `Current`
				: ``
	}`;

	const clearData = () => {
		navigate({
			from: "/",
			search: (prev) => ({
				...prev,
				country: "United States of America",
				date: formatDateParam(new Date()),
			}),
		});
	};

	if (!panel) return null;
	return (
		<Draggable
			nodeRef={nodeRef}
			bounds="parent"
			defaultClassNameDragged="cursor-grab"
			defaultClassNameDragging="cursor-grabbing"
			cancel="button"
		>
			<div
				ref={nodeRef}
				className="absolute top-2 right-2 w-40 rounded-lg border border-gray-300 bg-white md:top-8 md:right-8 md:w-60"
			>
				<dl className="flex flex-col">
					<div className="relative flex-auto p-1 md:p-2">
						<dt className="truncate text-center font-semibold text-gray-900 text-xs leading-tight md:whitespace-normal md:text-base">
							{country}
						</dt>
					</div>

					{leader?.name ? (
						<>
							<div className="space-y-0 border-gray-300 border-y p-1 md:space-y-1 md:p-2">
								<div className="flex w-full flex-none items-center gap-x-1">
									<dt className="flex-none">
										<span className="sr-only">Leader</span>
										<UserCircleIcon
											className="h-5 w-4 text-gray-600"
											aria-hidden="true"
										/>
									</dt>
									<dd className="font-medium text-gray-900 text-xs leading-tight md:text-sm">
										{name}
									</dd>
								</div>
								<div className="flex w-full flex-none items-center gap-x-1">
									<dt className="flex-none">
										<span className="sr-only">Time in Office</span>
										<ClockIcon
											className="h-5 w-4 text-gray-600"
											aria-hidden="true"
										/>
									</dt>
									<dd className="text-gray-500 text-xs italic leading-tight md:text-sm">
										<time dateTime="2023-01-31">{inOffice}</time>
									</dd>
								</div>
								<div className="flex w-full flex-none items-center gap-x-1">
									<dt className="flex-none">
										<span className="sr-only">Political Party</span>
										<AcademicCapIcon
											className="h-5 w-4 text-gray-600"
											aria-hidden="true"
										/>
									</dt>
									<dd className="text-gray-800 text-xs leading-tight md:text-sm">
										{party}
									</dd>
								</div>
								<div className="flex w-full flex-none items-center gap-x-1">
									<dt className="flex-none">
										<span className="sr-only">Political Leaning</span>
										<LightBulbIcon
											className="h-5 w-4 text-gray-600"
											aria-hidden="true"
										/>
									</dt>
									<dd className="text-gray-800 text-xs leading-tight md:text-sm">
										{leaning}
									</dd>
								</div>
							</div>

							<div className="relative flex-auto p-1 md:p-2">
								<button
									type="button"
									onClick={clearData}
									className="w-full rounded-md bg-white px-2.5 py-1 font-semibold text-gray-900 text-xs shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 active:scale-95"
								>
									Clear
								</button>
							</div>
						</>
					) : null}
				</dl>
			</div>
		</Draggable>
	);
};
