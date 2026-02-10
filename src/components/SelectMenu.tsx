import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import * as React from "react";

import { classNames } from "~/data/types";

type Props = {
	values: { id: number; name: string | number }[];
	title: string;
	selected: { id: number; name: string | number };
	setSelected: (value: { id: number; name: string | number }) => void;
};

export const SelectMenu = ({ values, title, selected, setSelected }: Props) => {
	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					<Listbox.Label className="block font-medium text-gray-900 text-sm leading-6">
						{title}
					</Listbox.Label>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pr-10 pl-3 text-left text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset focus:outline-none focus:ring-2 focus:ring-gray-600 sm:text-sm sm:leading-6">
							<span className="block truncate">{selected.name}</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={React.Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{values.map((x) => (
									<Listbox.Option
										key={x.id}
										className={({ active }) =>
											classNames(
												active ? `bg-gray-600 text-white` : `text-gray-900`,
												`relative cursor-default select-none py-2 pr-9 pl-3`,
											)
										}
										value={x}
									>
										{({ selected: sel, active }) => (
											<>
												<span
													className={classNames(
														sel ? `font-semibold` : `font-normal`,
														`block truncate`,
													)}
												>
													{x.name}
												</span>

												{sel ? (
													<span
														className={classNames(
															active ? `text-white` : `text-gray-600`,
															`absolute inset-y-0 right-0 flex items-center pr-4`,
														)}
													>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};
