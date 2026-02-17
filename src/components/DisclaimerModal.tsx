import {
	Description,
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import {
	EnvelopeIcon,
	ExclamationTriangleIcon,
	LightBulbIcon,
} from "@heroicons/react/24/solid";
import { getRouteApi, useNavigate } from "@tanstack/react-router";

const route = getRouteApi("/");

export const DisclaimerModal = () => {
	const { disclaimerModal } = route.useSearch();
	const navigate = useNavigate();

	return (
		<Transition appear show={disclaimerModal}>
			<Dialog
				onClose={() =>
					navigate({
						from: "/",
						search: (prev) => ({ ...prev, disclaimerModal: false }),
					})
				}
				className="fixed top-0 left-0 z-40 h-full w-full overflow-y-auto overflow-x-hidden text-gray-800"
			>
				<TransitionChild
					as="div"
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					className="fixed inset-0 bg-black/75"
					aria-hidden="true"
				/>

				<TransitionChild
					as="div"
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
					className="relative mx-auto flex h-full w-full max-w-3xl items-center px-2 py-14"
				>
					<DialogPanel className="relative flex max-h-full w-full flex-col overflow-hidden rounded border-none bg-gray-100">
						<div className="flex shrink-0 items-center justify-between rounded-t border-gray-300 border-b p-4">
							<DialogTitle className="font-bold text-2xl">
								Map Explanation
							</DialogTitle>
						</div>
						<div className="relative flex-auto overflow-y-auto p-4">
							<div className="mb-2 flex items-center">
								<ExclamationTriangleIcon className="mr-2 h-5 w-5 text-red-700" />
								<DialogTitle as="h3" className="font-semibold text-xl">
									Disclaimer
								</DialogTitle>
							</div>
							<Description className="mb-2">
								This is meant to be a fun, quick way to visualize the political
								history of Latin America. Reducing every president and political
								party to a single left-right axis is inherently oversimplistic
								and highly subjective.
							</Description>
							<Description className="mb-2">
								All the data comes from Wikipedia, relying mostly on its
								&#34;Ideology&#34; and &#34;Political Position&#34; metrics.
								When those were not available, I tried my best to approximate
								the closest position based on their policies, stated ideology,
								and political affiliations.
							</Description>
							<div className="mb-2 flex items-center">
								<LightBulbIcon className="mr-2 h-5 w-5 text-orange-400" />
								<DialogTitle as="h3" className="font-semibold text-xl">
									Methodology
								</DialogTitle>
							</div>
							<Description className="mb-2">
								To be clear, this gets harder and more absurd the farther back
								in time you go. The oldest political parties have often switched
								ideologies and priorities significantly throughout their
								history, and whatever the left-right spectrum roughly represents
								today is only vaguely applicable to the political stances of the
								1800s.
							</Description>
							<Description className="mb-2">
								In short, please do not take this map as any sort of
								authoritative reference, because the whole concept itself is
								inherently flawed! I made it to be a quick reference and fun
								visualization, nothing more.
							</Description>
							<div className="mb-2 flex items-center">
								<EnvelopeIcon className="mr-2 h-5 w-5 text-blue-600" />
								<DialogTitle as="h3" className="font-semibold text-xl">
									Contact Me
								</DialogTitle>
							</div>
							<Description className="mb-2">
								If you notice any errors in the data or any other bugs, or just
								have a comment, I would love to hear from you! You can contact
								me{` `}
								<a
									className="font-medium text-red-600 hover:underline"
									href="https://www.caleblovell.com/contact"
									target="_blank"
									rel="noreferrer"
								>
									here
								</a>
								, or on my social media listed below.
							</Description>
						</div>
						<div className="flex shrink-0 flex-wrap items-center justify-end rounded-b border-gray-300 border-t p-4">
							<button
								type="button"
								onClick={() =>
									navigate({
										from: "/",
										search: (prev) => ({ ...prev, disclaimerModal: false }),
									})
								}
								className="flex items-center rounded bg-gray-800 px-6 py-2.5 font-medium text-white text-xs uppercase leading-tight transition duration-150 ease-in-out hover:scale-105 hover:bg-gray-900 focus:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 active:bg-gray-800"
							>
								Close
							</button>
						</div>
					</DialogPanel>
				</TransitionChild>
			</Dialog>
		</Transition>
	);
};
