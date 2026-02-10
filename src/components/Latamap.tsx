import { getRouteApi } from "@tanstack/react-router";
import * as d3 from "d3";
import * as React from "react";
import { Borders } from "~/components/Borders";
import { Country } from "~/components/Country";
import { adjustCentroids, laTopoJson, mapHeight, mapWidth } from "~/data/map";
import { getLeadersByDate } from "~/data/types";
import { parseDateParam } from "~/routes/index";

const route = getRouteApi("/");

export const Latamap = () => {
	const { leaders } = route.useLoaderData();
	const { date: dateParam } = route.useSearch();
	const date = parseDateParam(dateParam);
	const leadersByDate = getLeadersByDate(leaders, date);
	const svgRef = React.useRef<SVGSVGElement>(null);
	const gRef = React.useRef<SVGGElement>(null);

	const zoom = React.useMemo(
		() =>
			d3
				.zoom()
				.scaleExtent([1, 8])
				.on(`zoom`, (event: any) => {
					d3.select(gRef.current).attr(`transform`, event.transform);
				}),
		[],
	);

	function reset() {
		if (!svgRef.current) return;
		const svg = d3.select(svgRef.current);
		svg
			.transition()
			.duration(750)
			.call(
				zoom.transform,
				d3.zoomIdentity,
				d3.zoomTransform(svgRef.current).invert([mapWidth / 2, mapHeight / 2]),
			);
	}

	return (
		<svg
			ref={svgRef}
			width="100%"
			height="100%"
			viewBox="-4 10 360 480"
			onClick={reset}
			onDoubleClick={() => d3.select(svgRef.current).call(zoom)}
		>
			<g ref={gRef}>
				{laTopoJson.features.map((feature) => {
					const name = feature.properties?.ADMIN;
					const leader = leadersByDate?.find((x) => x.Country.name === name);
					const centroid = adjustCentroids(feature);
					return (
						<Country
							key={name}
							feature={feature}
							centroid={centroid}
							leader={leader}
						/>
					);
				})}
				<Borders />
			</g>
		</svg>
	);
};
