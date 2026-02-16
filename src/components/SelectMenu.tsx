import {
	Label,
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

type Props = {
	values: { id: number; name: string | number }[];
	title: string;
	selected: { id: number; name: string | number };
	setSelected: (value: { id: number; name: string | number }) => void;
};

export const SelectMenu = ({ values, title, selected, setSelected }: Props) => {
	return (
		<Listbox as="div" value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					<Label className="block font-medium text-gray-900 text-sm leading-6">
						{title}
					</Label>
					<div className="relative mt-2">
						<ListboxButton className="relative w-full rounded-md bg-white py-1.5 pr-10 pl-3 text-left text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset focus:outline-none focus:ring-2 focus:ring-gray-600 sm:text-sm sm:leading-6">
							<span className="block truncate">{selected.name}</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronDownIcon
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</ListboxButton>

						<Transition
							as="div"
							show={open}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<ListboxOptions
								anchor="bottom"
								className="relative z-10 mt-1 h-76 w-132 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-2 ring-gray-300 ring-inset focus:outline-none sm:text-sm"
							>
								{values.map((x) => (
									<ListboxOption
										key={x.id}
										className={({ focus }) =>
											clsx(
												focus ? `bg-gray-600 text-white` : `text-gray-900`,
												`relative cursor-default select-none py-2 pr-9 pl-3`,
											)
										}
										value={x}
									>
										{({ selected, focus }) => (
											<>
												<span
													className={clsx(
														selected ? `font-semibold` : `font-normal`,
														`block truncate`,
													)}
												>
													{x.name}
												</span>

												{selected ? (
													<span
														className={clsx(
															focus ? `text-white` : `text-gray-600`,
															`absolute inset-y-0 right-0 flex items-center pr-4`,
														)}
													>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</ListboxOption>
								))}
							</ListboxOptions>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};
