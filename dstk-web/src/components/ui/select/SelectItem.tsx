import { Listbox } from '@headlessui/react';

import { cn } from '@/lib/cn';
import { CheckIcon } from '@heroicons/react/20/solid';

export type SelectItemProps = {
    children: React.ReactNode;
    value: string;
};

export const SelectItem = ({ children, value }: SelectItemProps) => {
    return (
        <Listbox.Option
            className={({ active }) =>
                cn(
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                )
            }
            value={value}
        >
            {({ selected, active }) => (
                <>
                    <span
                        className={cn(selected ? 'font-semibold' : 'font-normal', 'block truncate')}
                    >
                        {children}
                    </span>

                    {selected ? (
                        <span
                            className={cn(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                            )}
                        >
                            <CheckIcon className='h-5 w-5' />
                        </span>
                    ) : null}
                </>
            )}
        </Listbox.Option>
    );
};
