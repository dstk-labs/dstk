import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { NavigateFunction } from 'react-router-dom';

import { Button } from '@/components/ui';

type NoUsersAvailableProps = {
    navigateFn: NavigateFunction;
    teamId: string;
};

export const NoUsersAvailable = ({ navigateFn, teamId }: NoUsersAvailableProps) => {
    return (
        <div className='flex items-center mt-6 text-center border rounded-lg h-96'>
            <div className='flex flex-col w-full max-w-sm px-4 mx-auto'>
                <div className='p-3 mx-auto text-blue-500 bg-blue-100 rounded-full'>
                    <MagnifyingGlassIcon className='w-6 h-6' />
                </div>
                <h1 className='mt-3 text-lg text-gray-800'>No Users Available</h1>
                <p className='mt-2 text-gray-500'>
                    There are no new users available to add to the team.
                </p>
                <div className='mt-5 sm:mx-auto'>
                    <Button icon={ArrowLeftIcon} onClick={() => navigateFn(`/teams/${teamId}`)}>
                        Back
                    </Button>
                </div>
            </div>
        </div>
    );
};
