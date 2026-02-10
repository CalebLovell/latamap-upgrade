import { getRouteApi, useNavigate } from "@tanstack/react-router";
import type { Feature, GeoJsonProperties, Geometry } from "geojson";
import { useId } from "react";
import { path } from "~/data/map";
import type { LeaderReturn } from "~/data/types";
import { getLeaningColors } from "~/data/types";

const route = getRouteApi("/");

type Props = {
	feature: Feature<Geometry, GeoJsonProperties>;
	centroid: [number, number];
	leader: LeaderReturn | undefined;
};

export const Country = ({ feature, centroid, leader }: Props) => {
	const { scheme } = route.useSearch();
	const navigate = useNavigate();
	const patternId = useId();

	const name = feature.properties?.ADMIN;
	const ISO_A3 = feature.properties?.ISO_A3;
	const fill = leader
		? getLeaningColors(scheme)[
				leader.leaning as keyof ReturnType<typeof getLeaningColors>
			]
		: `url(#${patternId})`;
	const d = path(feature) ? String(path(feature)) : undefined;

	const onClick = () => {
		navigate({
			from: "/",
			search: (prev) => ({ ...prev, country: name }),
		});
	};

	return (
		<>
			{/** biome-ignore lint/a11y/useSemanticElements: <must be a path element> */}
			<path
				role="button"
				tabIndex={0}
				aria-label={`Select ${name}`}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						onClick();
					}
				}}
				id={name}
				d={d}
				fill={fill}
				onClick={onClick}
				className="focus:none cursor-pointer outline-none transition duration-500 ease-in-out hover:opacity-80 focus:opacity-80 active:opacity-50"
				style={{ WebkitTapHighlightColor: `transparent` }}
			/>
			<defs>
				<pattern
					id={patternId}
					width="5"
					height="5"
					patternUnits="userSpaceOnUse"
					patternTransform="rotate(45)"
				>
					<line x1="0" y1="0" x2="0" y2="5" stroke="black" strokeWidth="0.5" />
				</pattern>
			</defs>
			<text
				x={Math.round(centroid[0] * 100) / 100}
				y={Math.round(centroid[1] * 100) / 100}
				className="pointer-events-none select-none font-semibold"
				style={{
					fontWeight: `bold`,
					fontSize: `6px`,
					textAnchor: `middle`,
					alignmentBaseline: `middle`,
				}}
			>
				{ISO_A3}
			</text>
		</>
	);
};
