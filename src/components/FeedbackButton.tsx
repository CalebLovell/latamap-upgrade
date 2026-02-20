import { getRouteApi, useNavigate } from "@tanstack/react-router";

const route = getRouteApi("/");

export const FeedbackButton = () => {
	const { feedbackModal, timeline } = route.useSearch();
	const navigate = useNavigate();

	if (feedbackModal || timeline) return null;

	return (
		<button
			type="button"
			onClick={() =>
				navigate({
					from: "/",
					search: (prev) => ({ ...prev, feedbackModal: true }),
				})
			}
			className="fixed top-2/5 right-0 -translate-y-1/2 rounded-l-md border border-gray-300 border-r-0 bg-white px-1.5 py-3 text-gray-900 text-xs shadow transition-colors hover:bg-blue-50 hover:text-blue-700"
		>
			<span className="rotate-180 [writing-mode:vertical-rl]">Feedback</span>
		</button>
	);
};
