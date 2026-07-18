import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SelectMenu } from "~/components/SelectMenu";

afterEach(cleanup);

const values = [
	{ id: 1, name: "January" },
	{ id: 2, name: "February" },
	{ id: 3, name: "March" },
];

describe("SelectMenu", () => {
	it("shows the title and the currently selected value", () => {
		render(
			<SelectMenu
				values={values}
				title="Select a Month"
				selected={values[0]}
				setSelected={vi.fn()}
			/>,
		);
		expect(screen.getByText("Select a Month")).toBeInTheDocument();
		expect(screen.getByText("January")).toBeInTheDocument();
	});

	it("lists every option once the button is opened", () => {
		render(
			<SelectMenu
				values={values}
				title="Select a Month"
				selected={values[0]}
				setSelected={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("button"));
		for (const v of values) {
			expect(screen.getByRole("option", { name: v.name })).toBeInTheDocument();
		}
	});

	it("calls setSelected with the chosen option", () => {
		const setSelected = vi.fn();
		render(
			<SelectMenu
				values={values}
				title="Select a Month"
				selected={values[0]}
				setSelected={setSelected}
			/>,
		);
		fireEvent.click(screen.getByRole("button"));
		fireEvent.click(screen.getByRole("option", { name: "March" }));
		expect(setSelected).toHaveBeenCalledWith(values[2]);
	});
});
