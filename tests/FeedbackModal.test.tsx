import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const navigateMock = vi.fn();
const sendFeedbackMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
	getRouteApi: () => ({
		useSearch: () => ({ feedbackModal: true }),
	}),
	useNavigate: () => navigateMock,
}));

vi.mock("~/data/sendFeedback", () => ({
	sendFeedback: (...args: unknown[]) => sendFeedbackMock(...args),
}));

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

import { FeedbackModal } from "~/components/FeedbackModal";

afterEach(() => {
	cleanup();
	navigateMock.mockClear();
	sendFeedbackMock.mockClear();
	vi.restoreAllMocks();
});

function renderModal() {
	const queryClient = new QueryClient();
	return render(
		<QueryClientProvider client={queryClient}>
			<FeedbackModal />
		</QueryClientProvider>,
	);
}

describe("FeedbackModal", () => {
	it("submits the message with a trimmed, optional email", async () => {
		sendFeedbackMock.mockResolvedValueOnce({ success: true });
		renderModal();

		fireEvent.change(screen.getByPlaceholderText("Type your feedback here..."), {
			target: { value: "  Great map!  " },
		});
		fireEvent.change(screen.getByPlaceholderText("Your email (optional)"), {
			target: { value: "  me@example.com  " },
		});
		fireEvent.click(screen.getByRole("button", { name: /submit/i }));

		await waitFor(() =>
			expect(sendFeedbackMock).toHaveBeenCalledWith({
				data: { message: "Great map!", email: "me@example.com" },
			}),
		);
	});

	it("submits with an empty email when none is entered", async () => {
		sendFeedbackMock.mockResolvedValueOnce({ success: true });
		renderModal();

		fireEvent.change(screen.getByPlaceholderText("Type your feedback here..."), {
			target: { value: "No email here" },
		});
		fireEvent.click(screen.getByRole("button", { name: /submit/i }));

		await waitFor(() =>
			expect(sendFeedbackMock).toHaveBeenCalledWith({
				data: { message: "No email here", email: "" },
			}),
		);
	});

	it("closes without confirmation when the message is empty", () => {
		renderModal();

		fireEvent.click(screen.getByRole("button", { name: /close/i }));

		expect(navigateMock).toHaveBeenCalledTimes(1);
	});

	it("asks for confirmation before discarding a non-empty message, and stays open if declined", () => {
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
		renderModal();

		fireEvent.change(screen.getByPlaceholderText("Type your feedback here..."), {
			target: { value: "Don't lose this" },
		});
		fireEvent.click(screen.getByRole("button", { name: /close/i }));

		expect(confirmSpy).toHaveBeenCalledWith("Discard your feedback?");
		expect(navigateMock).not.toHaveBeenCalled();
	});

	it("closes when discard is confirmed", () => {
		vi.spyOn(window, "confirm").mockReturnValue(true);
		renderModal();

		fireEvent.change(screen.getByPlaceholderText("Type your feedback here..."), {
			target: { value: "Discard me" },
		});
		fireEvent.click(screen.getByRole("button", { name: /close/i }));

		expect(navigateMock).toHaveBeenCalledTimes(1);
	});

	it("shows an error toast and keeps the modal open when submission fails", async () => {
		const { toast } = await import("sonner");
		sendFeedbackMock.mockRejectedValueOnce(new Error("Failed to send feedback"));
		renderModal();

		fireEvent.change(screen.getByPlaceholderText("Type your feedback here..."), {
			target: { value: "This will fail" },
		});
		fireEvent.click(screen.getByRole("button", { name: /submit/i }));

		await waitFor(() => expect(toast.error).toHaveBeenCalled());
		expect(navigateMock).not.toHaveBeenCalled();
	});
});
