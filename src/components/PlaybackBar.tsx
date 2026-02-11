import {
	BackwardIcon,
	ForwardIcon,
	PauseCircleIcon,
	PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { timelineConfig } from "~/components/Timeline";
import { formatDateParam, parseDateParam } from "~/routes/index";

const route = getRouteApi("/");

type Props = {
	selectedYear: number;
	setSelectedYear: (year: number) => void;
};

export const PlaybackBar = ({ selectedYear, setSelectedYear }: Props) => {
	const { min, max } = timelineConfig;
	const { date: dateParam } = route.useSearch();
	const navigate = useNavigate();
	const date = parseDateParam(dateParam);

	const [isPlaying, setIsPlaying] = React.useState(false);
	const speeds = [
		{ value: 875, label: 0.25 },
		{ value: 750, label: 0.5 },
		{ value: 625, label: 0.75 },
		{ value: 500, label: 1 },
		{ value: 375, label: 1.25 },
		{ value: 250, label: 1.5 },
		{ value: 125, label: 1.75 },
		{ value: 67.5, label: 2 },
	];
	const baseSpeed = speeds[3];
	const [speed, setSpeed] = React.useState(baseSpeed);

	const increment = React.useCallback(() => {
		if (selectedYear === max) return;
		setSelectedYear(selectedYear + 1);
	}, [selectedYear, setSelectedYear]);

	React.useEffect(() => {
		if (!isPlaying) return;
		const interval = setInterval(() => {
			if (selectedYear === max) {
				clearInterval(interval);
				const newDate = new Date(min, date.getMonth(), date.getDate());
				navigate({
					from: "/",
					search: (prev) => ({ ...prev, date: formatDateParam(newDate) }),
				});
				return;
			}
			increment();
		}, speed.value);
		return () => clearInterval(interval);
	}, [date, increment, isPlaying, selectedYear, navigate, speed]);

	const increaseSpeed = () => {
		const index = speeds.findIndex((s) => s.value === speed.value);
		if (index === speeds.length - 1) return;
		setSpeed(speeds[index + 1]);
	};

	const decreaseSpeed = () => {
		const index = speeds.findIndex((s) => s.value === speed.value);
		if (index === 0) return;
		setSpeed(speeds[index - 1]);
	};

	return (
		<div className="relative flex items-center gap-4">
			<p className="absolute -left-19 font-bold text-sm">Speed</p>
			<button
				title="Decrease Timeline Speed"
				type="button"
				className="flex rounded-full p-1.5 text-gray-900 duration-150 ease-in-out hover:bg-blue-100 active:scale-95"
				onClick={decreaseSpeed}
			>
				<BackwardIcon className="h-8 w-8" />
			</button>
			<button
				title={isPlaying ? `Pause Timeline` : `Autoplay Timeline`}
				type="button"
				className="rounded-full p-1.5 text-gray-900 duration-150 ease-in-out hover:bg-blue-100 active:scale-95"
				onClick={() => setIsPlaying(!isPlaying)}
			>
				{isPlaying ? (
					<PauseCircleIcon className="h-8 w-8" />
				) : (
					<PlayCircleIcon className="h-8 w-8" />
				)}
			</button>
			<button
				title="Increase Timeline Speed"
				type="button"
				className="rounded-full p-1.5 text-gray-900 duration-150 ease-in-out hover:bg-blue-100 active:scale-95"
				onClick={increaseSpeed}
			>
				<ForwardIcon className="h-8 w-8" />
			</button>
			<p className="absolute -right-12 font-bold text-sm">{speed.label}x</p>
		</div>
	);
};
