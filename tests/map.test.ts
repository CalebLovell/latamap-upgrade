import type { Feature, GeoJsonProperties, Geometry } from "geojson";
import { describe, expect, it } from "vitest";
import { adjustCentroids, path } from "~/data/map";

function makeFeature(admin: string): Feature<Geometry, GeoJsonProperties> {
	return {
		type: "Feature",
		properties: { ADMIN: admin },
		geometry: { type: "Point", coordinates: [-70, -10] },
	};
}

describe("adjustCentroids", () => {
	it("returns the raw centroid for a country with no override", () => {
		const feature = makeFeature("Argentina");
		const baseline = path.centroid(feature);
		expect(adjustCentroids(feature)).toEqual(baseline);
	});

	it.each([
		["Peru", [-6, 0]],
		["Chile", [-10, -10]],
		["Guyana", [-2, -5]],
		["Panama", [3, -7]],
		["Costa Rica", [-4, 6]],
		["Nicaragua", [0, 1]],
		["Cuba", [4, -7]],
		["Guatemala", [-1, 2]],
		["Belize", [8, -1]],
		["El Salvador", [-1, 6]],
		["Jamaica", [-1, 6]],
		["Trinidad and Tobago", [0, -5]],
		["Puerto Rico", [0, -4]],
		["Dominican Republic", [3, -7]],
		["Haiti", [-2, 8]],
	] as const)("applies the documented offset for %s", (name, [dx, dy]) => {
		const feature = makeFeature(name);
		const baseline = path.centroid(feature);
		const adjusted = adjustCentroids(feature);
		expect(adjusted).toEqual([baseline[0] + dx, baseline[1] + dy]);
	});
});
