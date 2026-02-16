import { Transition, TransitionChild } from "@headlessui/react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { format } from "date-fns";
import { events } from "~/data/events";
import { formatDateParam, parseDateParam } from "~/routes/index";

const route = getRouteApi("/");

export const EventList = () => {
	const { timeline } = route.useSearch();

	return (
		<Transition show={timeline}>
			<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
				<TransitionChild
					as="div"
					enter="transform transition ease-in-out duration-500"
					enterFrom="translate-x-full"
					enterTo="translate-x-0"
					leave="transform transition ease-in-out duration-500"
					leaveFrom="translate-x-0"
					leaveTo="translate-x-full"
				>
					<div className="pointer-events-auto h-0 w-screen max-w-xl pl-2">
						<div className="mt-12 h-0.5 w-full" />
						<div className="flex h-slideover w-full flex-col bg-white min-[1920px]:bg-transparent">
							<SlideoverContent />
						</div>
					</div>
				</TransitionChild>
			</div>
		</Transition>
	);
};

const SlideoverContent = () => {
	const { date: dateParam } = route.useSearch();
	const navigate = useNavigate();
	const date = parseDateParam(dateParam);

	const formatDate = (d: Date | undefined) =>
		d ? format(new Date(d), `MMMM do, yyyy`) : undefined;

	return (
		<section className="overflow-auto pb-4">
			<ol className="relative pr-1 pb-1 pl-4">
				<div
					className="absolute bottom-1 left-3 inline-block border border-gray-900"
					style={{
						borderWidth: `0 3px 3px 0`,
						padding: `3px`,
						transform: `rotate(45deg)`,
					}}
				/>
				{events.map((x, i) => {
					const currentDate = formatDate(x.date) === formatDate(date);
					return (
						<li
							key={x.title}
							className={clsx(
								i === 0 ? `pt-0 lg:pt-2` : ``,
								`relative border-gray-900 border-l pl-4`,
							)}
						>
							<button
								className={clsx(
									currentDate
										? `border-2 border-blue-900`
										: `border-2 border-transparent`,
									`my-1 rounded-md px-2 py-0.5 text-left hover:bg-blue-200`,
								)}
								onClick={() => {
									navigate({
										from: "/",
										search: (prev) => ({
											...prev,
											date: formatDateParam(x.date),
											country: x.country,
										}),
									});
								}}
								type="button"
							>
								{i !== events.length - 1 && (
									<div className="absolute -bottom-[1.6rem] -left-[.27rem] h-2 w-2 rounded-full bg-gray-900 pt-2" />
								)}
								<time className="pb-1 font-semibold text-gray-500 text-xs leading-none">
									{formatDate(x.date)}
								</time>
								<h3 className="font-semibold text-gray-900 text-lg">
									{x.title}
								</h3>
								<p className="font-normal text-base text-gray-900">
									{x.description}
								</p>
							</button>
						</li>
					);
				})}
			</ol>
		</section>
	);
};
