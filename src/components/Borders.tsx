import { getRouteApi } from "@tanstack/react-router";
import * as React from "react";
import * as topojson from "topojson-client";
import type { GeometryObject } from "topojson-specification";

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

const countries = geoJSON.objects.countries as unknown as GeometryObject;

const getAdmin = (obj: GeometryObject): string | undefined =>
	(obj as GeometryObject & { properties?: { ADMIN?: string } }).properties
		?.ADMIN;

const SelectedBorders = () => {
	const { country: selectedCountry } = route.useSearch();

	const d = React.useMemo(() => {
		const outerBorders = topojson.mesh(
			geoJSON,
			countries,
			(a, b) =>
				a === b &&
				getAdmin(a) === selectedCountry &&
				getAdmin(b) === selectedCountry,
		);
		const innerBorders = topojson.mesh(
			geoJSON,
			countries,
			(a, b) =>
				a !== b &&
				(getAdmin(a) === selectedCountry || getAdmin(b) === selectedCountry),
		);
		const mapBorders: GeoJSON.MultiLineString = {
			type: `MultiLineString`,
			coordinates: outerBorders.coordinates.concat(innerBorders.coordinates),
		};
		const pathResult = path(mapBorders);
		return pathResult ? String(pathResult) : undefined;
	}, [selectedCountry]);

	return (
		<path
			d={d}
			strokeWidth={1.2}
			stroke="black"
			fill="none"
			className="transition duration-300 ease-in-out"
			strokeLinejoin="round"
		/>
	);
};

const UnselectedBorders = () => {
	const { country: selectedCountry } = route.useSearch();

	const d = React.useMemo(() => {
		const outerBorders = topojson.mesh(
			geoJSON,
			countries,
			(a, b) =>
				a === b &&
				getAdmin(a) !== selectedCountry &&
				getAdmin(b) !== selectedCountry,
		);
		const innerBorders = topojson.mesh(
			geoJSON,
			countries,
			(a, b) =>
				a !== b &&
				getAdmin(a) !== selectedCountry &&
				getAdmin(b) !== selectedCountry,
		);
		const mapBorders: GeoJSON.MultiLineString = {
			type: `MultiLineString`,
			coordinates: outerBorders.coordinates.concat(innerBorders.coordinates),
		};
		const pathResult = path(mapBorders);
		return pathResult ? String(pathResult) : undefined;
	}, [selectedCountry]);

	return (
		<path
			d={d}
			strokeWidth={0.5}
			stroke="white"
			fill="none"
			className="transition duration-300 ease-in-out"
			strokeLinejoin="round"
		/>
	);
};
