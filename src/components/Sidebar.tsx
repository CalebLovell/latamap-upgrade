import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import {
	ArrowPathRoundedSquareIcon,
	BookOpenIcon,
	CalendarIcon,
	ChatBubbleLeftEllipsisIcon,
	ClockIcon,
	ExclamationTriangleIcon,
	KeyIcon,
	SwatchIcon,
	TableCellsIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import * as React from "react";

const route = getRouteApi("/");

type SidebarProps = {
	lastUpdated: Date;
	mostRecentLeader: {
		name: string;
		tookOffice: Date;
		Country: {
			name: string;
		};
	} | null;
};

export const Sidebar = ({ lastUpdated, mostRecentLeader }: SidebarProps) => {
	const { menu } = route.useSearch();
	const navigate = useNavigate();

	const sections = [
		{
			title: `Map Controls`,
			options: [
				{
					title: `Select a Date`,
					onClick: () => {
						navigate({
							from: "/",
							search: (prev) => ({
								...prev,
								dateModal: true,
								menu: false,
							}),
						});
					},
					icon: <CalendarIcon className="h-6 w-6 text-blue-900" />,
				},
				{
					title: `Invert Color Scheme`,
					onClick: () =>
						navigate({
							from: "/",
							search: (prev) => ({
								...prev,
								scheme: prev.scheme === `inverted` ? `default` : `inverted`,
							}),
						}),
					icon: <SwatchIcon className="h-6 w-6 text-blue-900" />,
				},
				{
					title: `Toggle Map Key`,
					onClick: () =>
						navigate({
							from: "/",
							search: (prev) => ({ ...prev, key: !prev.key }),
						}),
					icon: <KeyIcon className="h-6 w-6 text-blue-900" />,
				},
				{
					title: `Toggle Data Panel`,
					onClick: () =>
						navigate({
							from: "/",
							search: (prev) => ({ ...prev, panel: !prev.panel }),
						}),
					icon: <TableCellsIcon className="h-6 w-6 text-blue-900" />,
				},
			],
		},
	];

	const formattedLastUpdated = `Data last updated on ${format(lastUpdated, `MMM do, yyyy`)}`;
	const formattedMostRecentLeader = `Newest officeholder: ${
		mostRecentLeader
			? `${mostRecentLeader.name}, ${mostRecentLeader.Country.name}`
			: `Unknown`
	}`;
	const formattedTookOffice = `Took office: ${
		mostRecentLeader
			? format(new Date(mostRecentLeader.tookOffice), `MMM do, yyyy`)
			: `Unknown`
	}`;

	return (
		<Transition show={menu}>
			<Dialog
				as="div"
				className="fixed inset-0 z-40 overflow-hidden"
				onClose={() =>
					navigate({
						from: "/",
						search: (prev) => ({ ...prev, menu: false }),
					})
				}
			>
				<TransitionChild
					as="div"
					enter="transition-opacity ease-linear duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity ease-linear duration-300"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					className="fixed inset-0 bg-gray-600/50"
				/>
				<div className="fixed inset-0 flex">
					<TransitionChild
						as="div"
						className="h-full"
						enter="transition ease-in-out duration-300 transform"
						enterFrom="-translate-x-full"
						enterTo="translate-x-0"
						leave="transition ease-in-out duration-300 transform"
						leaveFrom="translate-x-0"
						leaveTo="-translate-x-full"
					>
						<DialogPanel className="h-full">
							<div className="relative flex h-full w-80 shrink-0 flex-col items-center bg-white">
								<div className="flex h-12 w-full items-center justify-end p-2">
									<button
										title="Close Menu"
										type="button"
										className="flex transform rounded-md from-red-200 via-orange-200 to-blue-200 px-2 py-1.5 font-bold text-gray-900 duration-150 ease-in-out hover:bg-gray-300 active:scale-95"
										onClick={() =>
											navigate({
												from: "/",
												search: (prev) => ({
													...prev,
													menu: false,
												}),
											})
										}
									>
										<p className="mr-2 font-semibold">Close</p>
										<XMarkIcon
											className="h-6 w-6 text-red-600"
											aria-hidden="true"
										/>
									</button>
								</div>
								<div className="h-0.5 w-full bg-linear-to-r from-blue-400 via-orange-400 to-red-400" />
								<div className="flex h-full w-full flex-col justify-between overflow-auto bg-radial-[at_bottom_right] from-red-50 via-orange-50 to-blue-50 p-2">
									<div>
										<div className="mb-2 font-semibold text-gray-900 text-xs leading-6">
											Map Information
										</div>
										<div className="flex flex-col space-y-2 text-gray-900 text-sm">
											<p>
												This website is a visualization of the political history
												of Latin America. Use the timeline or calendar to select
												a date, and click on any country to see its data.
											</p>
											<p>
												You can also click and drag the map to pan around, and
												use the scroll wheel (or your fingers) to zoom in and
												out.
											</p>
											<p>
												The info panel and key are also both draggable and
												toggleable.
											</p>
										</div>
										{sections.map(({ title, options }) => (
											<React.Fragment key={title}>
												<div className="my-2 font-semibold text-gray-900 text-xs leading-6">
													{title}
												</div>
												<div className="space-y-2">
													{options.map((x) => (
														<button
															type="button"
															key={x.title}
															onClick={x.onClick}
															className="flex w-full items-center justify-between rounded-md border border-gray-400 bg-gray-200 p-2 text-center font-medium text-gray-900 text-sm transition duration-150 ease-in-out hover:bg-gray-300 active:scale-95"
														>
															{x.title}
															{x.icon}
														</button>
													))}
													<div className="my-2 font-semibold text-gray-900 text-xs leading-6">
														Read More
													</div>
													<button
														type="button"
														key="Methodology Disclaimer"
														onClick={() => {
															navigate({
																from: "/",
																search: (prev) => ({
																	...prev,
																	disclaimerModal: true,
																	menu: false,
																}),
															});
														}}
														className="plausible-event-name=Disclaimer flex w-full items-center justify-between rounded-md border border-gray-400 bg-gray-200 p-2 text-center font-medium text-gray-900 text-sm transition duration-150 ease-in-out hover:bg-gray-300 active:scale-95"
													>
														Methodology Disclaimer
														<ExclamationTriangleIcon className="h-6 w-6 text-blue-900" />
													</button>
													<button
														type="button"
														onClick={() => {
															navigate({
																from: "/",
																search: (prev) => ({
																	...prev,
																	feedbackModal: true,
																	menu: false,
																}),
															});
														}}
														className="flex w-full items-center justify-between rounded-md border border-gray-400 bg-gray-200 p-2 text-center font-medium text-gray-900 text-sm transition duration-150 ease-in-out hover:bg-gray-300 active:scale-95"
													>
														Send Feedback
														<ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-blue-900" />
													</button>
													<a
														className="flex w-full items-center justify-between rounded-md border border-gray-400 bg-gray-200 p-2 text-center font-medium text-gray-900 text-sm transition duration-150 ease-in-out hover:bg-gray-300 active:scale-95"
														href="https://www.caleblovell.com/blog/building-latamap-website"
														target="_blank"
														rel="noreferrer"
													>
														Website Building Process
														<BookOpenIcon className="h-6 w-6 text-blue-900" />
													</a>
													<a
														className="flex w-full items-center justify-between rounded-md border border-gray-400 bg-gray-200 p-2 text-center font-medium text-gray-900 text-sm transition duration-150 ease-in-out hover:bg-gray-300 active:scale-95"
														href="https://www.caleblovell.com/blog/going-viral-on-twitter"
														target="_blank"
														rel="noreferrer"
													>
														Going Viral on Twitter
														<svg
															className="h-6 w-6 text-blue-900"
															fill="currentColor"
															viewBox="0 0 24 24"
															aria-hidden="true"
														>
															<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
														</svg>
													</a>
												</div>
											</React.Fragment>
										))}
									</div>
									<div className="flex flex-col justify-center pt-2">
										<div className="flex items-center justify-center space-x-1 pt-2">
											<ArrowPathRoundedSquareIcon className="h-3.5 w-3.5 text-gray-900" />
											<p className="text-center font-semibold text-gray-900 text-xs italic">
												{formattedLastUpdated}
											</p>
										</div>
										<div className="flex items-center justify-center space-x-1 pt-2">
											<ClockIcon className="h-3.5 w-3.5 text-gray-900" />
											<p className="text-center font-semibold text-gray-900 text-xs italic">
												{formattedMostRecentLeader}
											</p>
										</div>
										<div className="flex items-center justify-center space-x-1 pt-2">
											<CalendarIcon className="h-3.5 w-3.5 text-gray-900" />
											<p className="text-center font-semibold text-gray-900 text-xs italic">
												{formattedTookOffice}
											</p>
										</div>
										<div className="flex items-center justify-center space-x-2 pt-2">
											{socials.map((x) => (
												<a
													key={x.title}
													href={x.href}
													className="rounded p-2 text-blue-900 transition duration-150 ease-in-out hover:rotate-12 hover:bg-gray-200"
													target="_blank"
													rel="noreferrer"
												>
													<span className="sr-only">{x.title}</span>
													{x.svg}
												</a>
											))}
										</div>
									</div>
								</div>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</Dialog>
		</Transition>
	);
};

const socials = [
	{
		title: `Twitter`,
		href: `https://twitter.com/CalebLovell`,
		svg: (
			<svg
				className="h-6 w-6"
				fill="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
			</svg>
		),
	},
	{
		title: `GitHub`,
		href: `https://github.com/CalebLovell`,
		svg: (
			<svg
				className="h-6 w-6"
				fill="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					fillRule="evenodd"
					d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	{
		title: `LinkedIn`,
		href: `https://www.linkedin.com/in/caleblovell/`,
		svg: (
			<svg
				className="h-6 w-6"
				fill="currentColor"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
			</svg>
		),
	},
];
