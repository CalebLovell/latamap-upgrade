import { getRouteApi } from "@tanstack/react-router";
import * as topojson from "topojson-client";

import { path } from "~/data/map";
import { geoJSON } from "~/data/worldGeojson";

const route = getRouteApi("/");

export const Borders = () => {
	return (
		<>
			<SelectedBorders />
			<UnselectedBorders />
		</>
	);
};

const SelectedBorders = () => {
	const { country: selectedCountry } = route.useSearch();

	const countries = geoJSON.objects.countries;

	const outerBorders = topojson.mesh(
		geoJSON,
		// @ts-expect-error
		countries,
		// @ts-expect-error
		(a, b) =>
			a === b &&
			a.properties.ADMIN === selectedCountry &&
			b.properties.ADMIN === selectedCountry,
	);
	const innerBorders = topojson.mesh(
		geoJSON,
		// @ts-expect-error
		countries,
		// @ts-expect-error
		(a, b) =>
			a !== b &&
			(a.properties.ADMIN === selectedCountry ||
				b.properties.ADMIN === selectedCountry),
	);
	const mapBorders = {
		type: `MultiLineString`,
		coordinates: outerBorders.coordinates.concat(innerBorders.coordinates),
	};

	// @ts-expect-error
	const d = path(mapBorders) ? String(path(mapBorders)) : undefined;

	const stroke = `black`;
	const strokeWidth = 1.2;

	return (
		<path
			d={d}
			strokeWidth={strokeWidth}
			stroke={stroke}
			fill="none"
			className="transition duration-300 ease-in-out"
			strokeLinejoin="round"
		/>
	);
};

const UnselectedBorders = () => {
	const { country: selectedCountry } = route.useSearch();

	const outerBorders = topojson.mesh(
		geoJSON,
		// @ts-expect-error
		geoJSON.objects.countries,
		// @ts-expect-error
		(a, b) =>
			a === b &&
			a.properties.ADMIN !== selectedCountry &&
			b.properties.ADMIN !== selectedCountry,
	);
	const innerBorders = topojson.mesh(
		geoJSON,
		// @ts-expect-error
		geoJSON.objects.countries,
		// @ts-expect-error
		(a, b) =>
			a !== b &&
			a.properties.ADMIN !== selectedCountry &&
			b.properties.ADMIN !== selectedCountry,
	);
	const mapBorders = {
		type: `MultiLineString`,
		coordinates: outerBorders.coordinates.concat(innerBorders.coordinates),
	};

	// @ts-expect-error
	const d = path(mapBorders) ? String(path(mapBorders)) : undefined;

	const stroke = `white`;
	const strokeWidth = 0.5;

	return (
		<path
			d={d}
			strokeWidth={strokeWidth}
			stroke={stroke}
			fill="none"
			className="transition duration-300 ease-in-out"
			strokeLinejoin="round"
		/>
	);
};
