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
import type { LeaderReturn } from "~/data/types";
import { getLeadersByDate, leaningLabels } from "~/data/types";
import { formatDateParam, parseDateParam } from "~/routes/index";

const route = getRouteApi("/");

const formatDate = (date: Date | undefined) =>
	date ? format(new Date(date), `MMM d, yyyy`) : undefined;

const buttonClasses = `w-full rounded-md bg-white px-2 py-1 font-semibold text-gray-900 text-xs shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 active:scale-95`;

const LeaderDetails = ({ leader }: { leader: LeaderReturn }) => {
	const leaning =
		leader.leaning != null
			? leaningLabels[leader.leaning as keyof typeof leaningLabels]
			: `-`;
	const inOffice = `${leader.tookOffice ? formatDate(leader.tookOffice) : ``} - ${
		leader.leftOffice
			? formatDate(leader.leftOffice)
			: leader.leftOffice === null
				? `Current`
				: ``
	}`;

	return (
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
					{leader.name || `-`}
				</dd>
			</div>
			<div className="flex w-full flex-none items-center gap-x-1">
				<dt className="flex-none">
					<span className="sr-only">Time in Office</span>
					<ClockIcon className="h-5 w-4 text-gray-600" aria-hidden="true" />
				</dt>
				<dd className="text-gray-500 text-xs italic leading-tight md:text-sm">
					<time
						dateTime={
							leader.tookOffice
								? formatDateParam(new Date(leader.tookOffice))
								: undefined
						}
					>
						{inOffice}
					</time>
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
					{leader.party || `-`}
				</dd>
			</div>
			<div className="flex w-full flex-none items-center gap-x-1">
				<dt className="flex-none">
					<span className="sr-only">Political Leaning</span>
					<LightBulbIcon className="h-5 w-4 text-gray-600" aria-hidden="true" />
				</dt>
				<dd className="text-gray-800 text-xs leading-tight md:text-sm">
					{leaning}
				</dd>
			</div>
		</div>
	);
};

export const DataPanel = () => {
	const nodeRef = useRef<HTMLDivElement>(null);
	const {
		panel,
		date: dateParam,
		country: selectedCountry,
		compare: pinnedCountry,
	} = route.useSearch();
	const navigate = useNavigate();
	const { leaders } = route.useLoaderData();
	const date = parseDateParam(dateParam);
	const leadersByDate = getLeadersByDate(leaders, date);

	const hasPin = pinnedCountry !== "";
	const selectedIsPinned = hasPin && pinnedCountry === selectedCountry;
	const pinnedLeader = leadersByDate?.find(
		(x) => x.Country.name === pinnedCountry,
	);
	const selectedLeader = leadersByDate?.find(
		(x) => x.Country.name === selectedCountry,
	);

	const pin = () => {
		navigate({
			from: "/",
			search: (prev) => ({ ...prev, compare: selectedCountry }),
		});
	};

	const unpin = () => {
		navigate({
			from: "/",
			search: (prev) => ({ ...prev, country: pinnedCountry, compare: "" }),
		});
	};

	const clearPin = () => {
		navigate({
			from: "/",
			search: (prev) => ({ ...prev, compare: "" }),
		});
	};

	const clearSelection = () => {
		navigate({
			from: "/",
			search: (prev) => ({ ...prev, country: "" }),
		});
	};

	const swap = () => {
		navigate({
			from: "/",
			search: (prev) => ({
				...prev,
				country: pinnedCountry,
				compare: selectedCountry,
			}),
		});
	};

	const clearData = () => {
		navigate({
			from: "/",
			search: (prev) => ({
				...prev,
				country: "United States of America",
				date: formatDateParam(new Date()),
				compare: "",
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
				className="absolute top-2 right-2 flex max-h-[80%] w-40 flex-col overflow-y-auto rounded-lg border border-gray-300 bg-white md:top-8 md:right-8 md:w-60"
			>
				<dl className="flex flex-col">
					{hasPin ? (
						<div>
							<div className="relative flex-auto p-1 md:p-2">
								<dt className="truncate text-center font-semibold text-gray-900 text-xs leading-tight md:whitespace-normal md:text-base">
									{pinnedCountry}
								</dt>
							</div>
							{pinnedLeader ? (
								<LeaderDetails leader={pinnedLeader} />
							) : (
								<div className="border-gray-300 border-y p-1 md:p-2">
									<dd className="text-gray-500 text-xs italic leading-tight md:text-sm">
										No data
									</dd>
								</div>
							)}
							<div className="flex flex-auto gap-1 p-1 md:gap-2 md:p-2">
								<button type="button" onClick={unpin} className={buttonClasses}>
									Unpin
								</button>
								<button
									type="button"
									onClick={selectedIsPinned ? clearData : clearPin}
									className={buttonClasses}
								>
									Clear
								</button>
							</div>
						</div>
					) : null}

					{!selectedIsPinned ? (
						<div className={hasPin ? `border-gray-300 border-t` : ``}>
							<div className="relative flex-auto p-1 md:p-2">
								<dt className="truncate text-center font-semibold text-gray-900 text-xs leading-tight md:whitespace-normal md:text-base">
									{selectedCountry || `Select a Country`}
								</dt>
							</div>
							{selectedLeader ? (
								<LeaderDetails leader={selectedLeader} />
							) : hasPin && selectedCountry ? (
								<div className="border-gray-300 border-y p-1 md:p-2">
									<dd className="text-gray-500 text-xs italic leading-tight md:text-sm">
										No data
									</dd>
								</div>
							) : null}
							{selectedCountry && (selectedLeader?.name || hasPin) ? (
								<div className="flex flex-auto gap-1 p-1 md:gap-2 md:p-2">
									{hasPin ? (
										<button
											type="button"
											onClick={swap}
											className={buttonClasses}
										>
											Swap
										</button>
									) : (
										<button
											type="button"
											onClick={pin}
											className={buttonClasses}
										>
											Pin to compare
										</button>
									)}
									<button
										type="button"
										onClick={hasPin ? clearSelection : clearData}
										className={buttonClasses}
									>
										Clear
									</button>
								</div>
							) : null}
						</div>
					) : null}
				</dl>
			</div>
		</Draggable>
	);
};
