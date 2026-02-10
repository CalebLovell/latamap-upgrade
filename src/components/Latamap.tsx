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
				.on(`zoom`, (event: d3.D3ZoomEvent<SVGElement, unknown>) => {
					d3.select(gRef.current).attr(`transform`, event.transform.toString());
				}),
		[],
	);

	React.useEffect(() => {
		if (svgRef.current) {
			d3.select<SVGSVGElement, unknown>(svgRef.current).call(
				zoom as unknown as d3.ZoomBehavior<SVGSVGElement, unknown>,
			);
		}
	}, [zoom]);

	function reset() {
		if (!svgRef.current) return;
		const svg = d3.select(svgRef.current);
		(svg as unknown as d3.Selection<SVGSVGElement, unknown, null, undefined>)
			.transition()
			.duration(750)
			.call(
				// @ts-expect-error types are unknown
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
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					reset();
				}
			}}
			aria-label="Latin America Map"
		>
			<title>Latin America Map</title>
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
