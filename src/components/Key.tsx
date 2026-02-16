import { getRouteApi } from "@tanstack/react-router";
import { useRef } from "react";
import Draggable from "react-draggable";
import { getLeaningColors, leaningLabels } from "~/data/types";

const route = getRouteApi("/");

export const Key = () => {
	const nodeRef = useRef<HTMLDivElement>(null);
	const { key, scheme } = route.useSearch();

	const colors = getLeaningColors(scheme);
	const entries = Object.entries(leaningLabels);
	const reordered = [...entries.slice(1), entries[0]];

	if (!key) return null;
	return (
		<Draggable
			nodeRef={nodeRef}
			bounds="parent"
			defaultClassNameDragged="cursor-grab"
			defaultClassNameDragging="cursor-grabbing"
		>
			<div
				ref={nodeRef}
				className="absolute bottom-4 left-0.5 rounded-lg p-2 md:bottom-16"
			>
				{reordered.map(([colorIndex, label]) => (
					<div key={label} className="mt-1 flex items-center">
						<div
							className="mr-2 h-6 w-1.5 transition duration-500 ease-in-out sm:h-10"
							style={{
								backgroundColor:
									colors[Number(colorIndex) as keyof typeof colors],
							}}
						/>
						<p className="font-semibold text-black text-xs sm:text-sm">
							{label}
						</p>
					</div>
				))}
			</div>
		</Draggable>
	);
};
