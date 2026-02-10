import { getRouteApi } from "@tanstack/react-router";
import { useRef } from "react";
import Draggable from "react-draggable";
import { getLeaningColors, leaningLabels } from "~/data/types";

const route = getRouteApi("/");

export const Key = () => {
	const nodeRef = useRef<HTMLDivElement>(null);
	const { key, scheme } = route.useSearch();

	const colors = getLeaningColors(scheme);
	const labels = Object.values(leaningLabels);

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
				{labels.map((label, index) => (
					<div key={label} className="mt-1 flex items-center">
						<div
							className="mr-2 h-6 w-1.5 transition duration-500 ease-in-out sm:h-10"
							style={{
								backgroundColor: colors[(index + 1) as keyof typeof colors],
							}}
						/>
						<p className="text-xs font-semibold text-black sm:text-sm">
							{label}
						</p>
					</div>
				))}
			</div>
		</Draggable>
	);
};
