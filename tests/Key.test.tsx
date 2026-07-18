import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

let searchValue: { key: boolean; scheme: "default" | "inverted" } = {
	key: true,
	scheme: "default",
};

vi.mock("@tanstack/react-router", () => ({
	getRouteApi: () => ({
		useSearch: () => searchValue,
	}),
}));

import { Key } from "~/components/Key";
import { leaningLabels } from "~/data/types";

afterEach(() => {
	cleanup();
	searchValue = { key: true, scheme: "default" };
});

describe("Key", () => {
	it("renders nothing when the key search param is false", () => {
		searchValue = { key: false, scheme: "default" };
		const { container } = render(<Key />);
		expect(container).toBeEmptyDOMElement();
	});

	it("renders a label for every leaning, with 'None' moved to the end", () => {
		render(<Key />);
		const labels = screen.getAllByText(
			new RegExp(Object.values(leaningLabels).join("|")),
		);
		expect(labels).toHaveLength(Object.keys(leaningLabels).length);
		expect(labels[labels.length - 1]).toHaveTextContent(leaningLabels[0]);
		expect(labels[0]).not.toHaveTextContent(leaningLabels[0]);
	});

	it("uses the default color scheme's Far Left color when scheme is 'default'", () => {
		searchValue = { key: true, scheme: "default" };
		render(<Key />);
		const farLeft = screen.getByText(leaningLabels[1]);
		const swatch = farLeft.previousElementSibling as HTMLElement;
		expect(swatch.style.backgroundColor).toBe("rgb(157, 0, 0)");
	});

	it("uses the inverted color scheme's Far Left color when scheme is 'inverted'", () => {
		searchValue = { key: true, scheme: "inverted" };
		render(<Key />);
		const farLeft = screen.getByText(leaningLabels[1]);
		const swatch = farLeft.previousElementSibling as HTMLElement;
		expect(swatch.style.backgroundColor).toBe("rgb(0, 96, 147)");
	});
});
