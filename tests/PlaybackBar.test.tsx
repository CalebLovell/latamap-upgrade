import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("~/components/Timeline", () => ({
	timelineConfig: { step: 1, min: 1789, max: 2026, background: "", accent: "" },
}));

import { PlaybackBar } from "~/components/PlaybackBar";

afterEach(cleanup);

describe("PlaybackBar", () => {
	const defaultProps = {
		selectedYear: 2000,
		setSelectedYear: vi.fn(),
	};

	it("renders play button initially", () => {
		render(<PlaybackBar {...defaultProps} />);
		expect(
			screen.getByTitle("Autoplay Timeline"),
		).toBeInTheDocument();
	});

	it("toggles to pause button when clicked", () => {
		render(<PlaybackBar {...defaultProps} />);
		fireEvent.click(screen.getByTitle("Autoplay Timeline"));
		expect(screen.getByTitle("Pause Timeline")).toBeInTheDocument();
	});

	it("toggles back to play when paused", () => {
		render(<PlaybackBar {...defaultProps} />);
		const playBtn = screen.getByTitle("Autoplay Timeline");
		fireEvent.click(playBtn);
		fireEvent.click(screen.getByTitle("Pause Timeline"));
		expect(screen.getByTitle("Autoplay Timeline")).toBeInTheDocument();
	});

	it("renders speed controls", () => {
		render(<PlaybackBar {...defaultProps} />);
		expect(
			screen.getByTitle("Decrease Timeline Speed"),
		).toBeInTheDocument();
		expect(
			screen.getByTitle("Increase Timeline Speed"),
		).toBeInTheDocument();
	});

	it("shows default speed of 1x", () => {
		render(<PlaybackBar {...defaultProps} />);
		expect(screen.getByText("1x")).toBeInTheDocument();
	});

	it("increases speed when increase button is clicked", () => {
		render(<PlaybackBar {...defaultProps} />);
		fireEvent.click(screen.getByTitle("Increase Timeline Speed"));
		expect(screen.getByText("1.25x")).toBeInTheDocument();
	});

	it("decreases speed when decrease button is clicked", () => {
		render(<PlaybackBar {...defaultProps} />);
		fireEvent.click(screen.getByTitle("Increase Timeline Speed"));
		expect(screen.getByText("1.25x")).toBeInTheDocument();
		fireEvent.click(screen.getByTitle("Decrease Timeline Speed"));
		expect(screen.getByText("1x")).toBeInTheDocument();
	});

	it("does not exceed max speed of 2x", () => {
		render(<PlaybackBar {...defaultProps} />);
		const increaseBtn = screen.getByTitle("Increase Timeline Speed");
		for (let i = 0; i < 10; i++) {
			fireEvent.click(increaseBtn);
		}
		expect(screen.getByText("2x")).toBeInTheDocument();
	});

	it("does not go below min speed of 0.25x", () => {
		render(<PlaybackBar {...defaultProps} />);
		const decreaseBtn = screen.getByTitle("Decrease Timeline Speed");
		for (let i = 0; i < 10; i++) {
			fireEvent.click(decreaseBtn);
		}
		expect(screen.getByText("0.25x")).toBeInTheDocument();
	});
});
