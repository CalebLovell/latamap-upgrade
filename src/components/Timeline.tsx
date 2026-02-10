import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import * as React from "react";
import { getTrackBackground, Range } from "react-range";
import { PlaybackBar } from "~/components/PlaybackBar";
import { useMapStore } from "~/data/store";

export const timelineConfig = {
	step: 1,
	min: 1789,
	max: new Date().getFullYear(),
	background: `rgb(31 41 55)`,
	accent: `rgb(156 163 175)`,
};

export const Timeline = () => {
	const { date, setDate } = useMapStore();
	const selectedYear = date.getFullYear();
	const setSelectedYear = React.useCallback(
		(year: number) => setDate(new Date(year, date.getMonth(), date.getDate())),
		[date, setDate],
	);

	return (
		<div className="flex h-20 w-full flex-col px-2 md:px-12">
			<div className="flex h-8 w-full items-center justify-between">
				<Slider selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
			</div>
			<div className="flex h-12 w-full flex-col items-center justify-center">
				<PlaybackBar
					selectedYear={selectedYear}
					setSelectedYear={setSelectedYear}
				/>
			</div>
		</div>
	);
};

type Props = {
	selectedYear: number;
	setSelectedYear: (year: number) => void;
};

const Slider = ({ selectedYear, setSelectedYear }: Props) => {
	const { step, min, max, background, accent } = timelineConfig;

	const onChange = (vals: number[]) => {
		setSelectedYear(vals[0]);
	};

	const increment = React.useCallback(() => {
		if (selectedYear === max) return;
		setSelectedYear(selectedYear + 1);
	}, [selectedYear, setSelectedYear, max]);

	const decrement = React.useCallback(() => {
		if (selectedYear === min) return setSelectedYear(max);
		setSelectedYear(selectedYear - 1);
	}, [selectedYear, setSelectedYear, min, max]);

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") decrement();
			if (e.key === "ArrowRight") increment();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [decrement, increment]);

	return (
		<>
			<button
				type="button"
				title="Previous Year"
				onClick={decrement}
				className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 active:scale-95"
			>
				<ChevronLeftIcon className="mr-0.5 h-6 w-6 text-gray-800" />
			</button>
			<Range
				values={[selectedYear]}
				step={step}
				min={min}
				max={max}
				onChange={onChange}
				renderTrack={({ props, children }) => (
					<div
						onMouseDown={props.onMouseDown}
						onTouchStart={props.onTouchStart}
						className="flex h-full w-full px-6"
					>
						<div
							ref={props.ref}
							className="h-1.5 w-full self-center rounded-full bg-gray-400"
							style={{
								background: getTrackBackground({
									values: [selectedYear],
									colors: [background, accent],
									min,
									max,
								}),
							}}
						>
							{children}
						</div>
					</div>
				)}
				renderThumb={({ props, isDragged }) => {
					const { key, ...restProps } = props;
					return (
						<div
							key={key}
							{...restProps}
							className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
						>
							<div className="absolute -top-10 rounded-sm bg-gray-800 px-2 py-1 text-white">
								{selectedYear}
							</div>
							<div
								className={clsx(
									`h-1/2 w-1`,
									`${isDragged ? `bg-gray-800` : `bg-gray-400`}`,
								)}
							/>
						</div>
					);
				}}
			/>
			<button
				type="button"
				title="Next Year"
				onClick={increment}
				className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 active:scale-95"
			>
				<ChevronRightIcon className="ml-0.5 h-6 w-6 text-gray-800" />
			</button>
		</>
	);
};
