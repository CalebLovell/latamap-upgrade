import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockLeader } from "./factories";

type SearchValue = {
	panel: boolean;
	date: string;
	country: string;
	compare: string;
};

let searchValue: SearchValue = {
	panel: true,
	date: "2024-01-01",
	country: "Brazil",
	compare: "",
};

const navigateMock = vi.fn();

const leaders = [
	createMockLeader({
		name: "Leader A",
		party: "Party A",
		leaning: 2,
		tookOffice: new Date(2020, 0, 1),
		leftOffice: null,
		Country: { name: "Brazil" },
	}),
	createMockLeader({
		name: "Leader B",
		party: "Party B",
		leaning: 6,
		tookOffice: new Date(2021, 0, 1),
		leftOffice: null,
		Country: { name: "Argentina" },
	}),
];

vi.mock("@tanstack/react-router", () => ({
	getRouteApi: () => ({
		useSearch: () => searchValue,
		useLoaderData: () => ({ leaders }),
	}),
	useNavigate: () => navigateMock,
}));

vi.mock("~/routes/index", async () => {
	const { formatDateParam, parseDateParam } = await import("~/utils/date");
	return { formatDateParam, parseDateParam };
});

import { DataPanel } from "~/components/DataPanel";

afterEach(() => {
	cleanup();
	navigateMock.mockClear();
	searchValue = {
		panel: true,
		date: "2024-01-01",
		country: "Brazil",
		compare: "",
	};
});

const lastSearchUpdate = () => {
	const { search } = navigateMock.mock.calls.at(-1)?.[0] ?? {};
	return search(searchValue);
};

describe("DataPanel", () => {
	it("renders nothing when the panel search param is false", () => {
		searchValue.panel = false;
		const { container } = render(<DataPanel />);
		expect(container).toBeEmptyDOMElement();
	});

	it("shows only the selected country when nothing is pinned", () => {
		render(<DataPanel />);
		expect(screen.getByText("Brazil")).toBeInTheDocument();
		expect(screen.getByText("Leader A")).toBeInTheDocument();
		expect(screen.queryByText("Argentina")).not.toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /pin to compare/i }),
		).toBeInTheDocument();
	});

	it("shows the pinned country on top of the selected country", () => {
		searchValue.compare = "Argentina";
		render(<DataPanel />);
		const titles = screen
			.getAllByText(/Argentina|Brazil/)
			.map((el) => el.textContent);
		expect(titles).toEqual(["Argentina", "Brazil"]);
		expect(screen.getByText("Leader A")).toBeInTheDocument();
		expect(screen.getByText("Leader B")).toBeInTheDocument();
	});

	it("pins the selected country to the comparison", () => {
		render(<DataPanel />);
		fireEvent.click(screen.getByRole("button", { name: /pin to compare/i }));
		expect(lastSearchUpdate().compare).toBe("Brazil");
	});

	it("unpin demotes the pinned country to the regular selection", () => {
		searchValue.compare = "Argentina";
		render(<DataPanel />);
		fireEvent.click(screen.getByRole("button", { name: /unpin/i }));
		const search = lastSearchUpdate();
		expect(search.compare).toBe("");
		expect(search.country).toBe("Argentina");
	});

	it("the pinned card's Clear removes only the pin, keeping the selection", () => {
		searchValue.compare = "Argentina";
		render(<DataPanel />);
		const clearButtons = screen.getAllByRole("button", { name: /clear/i });
		fireEvent.click(clearButtons[0]);
		const search = lastSearchUpdate();
		expect(search.compare).toBe("");
		expect(search.country).toBe("Brazil");
	});

	it("the selected card's Clear empties only the selection, keeping the pin", () => {
		searchValue.compare = "Argentina";
		render(<DataPanel />);
		const clearButtons = screen.getAllByRole("button", { name: /clear/i });
		fireEvent.click(clearButtons[1]);
		const search = lastSearchUpdate();
		expect(search.compare).toBe("Argentina");
		expect(search.country).toBe("");
	});

	it("shows a placeholder without Swap/Clear when pinned with no selection", () => {
		searchValue.country = "";
		searchValue.compare = "Argentina";
		render(<DataPanel />);
		expect(screen.getByText("Select a Country")).toBeInTheDocument();
		expect(screen.getByText("Leader B")).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /swap/i }),
		).not.toBeInTheDocument();
		expect(screen.getAllByRole("button", { name: /clear/i })).toHaveLength(1);
	});

	it("shows a single card with Unpin when the pinned country is also selected", () => {
		searchValue.compare = "Brazil";
		render(<DataPanel />);
		expect(screen.getAllByText("Brazil")).toHaveLength(1);
		expect(screen.getByRole("button", { name: /unpin/i })).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /swap/i }),
		).not.toBeInTheDocument();
	});

	it("swaps the pinned and selected countries", () => {
		searchValue.compare = "Argentina";
		render(<DataPanel />);
		fireEvent.click(screen.getByRole("button", { name: /swap/i }));
		const search = lastSearchUpdate();
		expect(search.country).toBe("Argentina");
		expect(search.compare).toBe("Brazil");
	});

	it("Clear resets everything when nothing is pinned", () => {
		render(<DataPanel />);
		fireEvent.click(screen.getByRole("button", { name: /clear/i }));
		const search = lastSearchUpdate();
		expect(search.compare).toBe("");
		expect(search.country).toBe("United States of America");
	});
});
