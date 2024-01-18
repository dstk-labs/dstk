import { ArrowPathIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { type NavigateFunction } from 'react-router-dom';

import { Card, CardBody, CardHeader } from '@/components/ui';
import { Team } from '@/types/Team';

type TeamCardsProps = {
    navigateFn: NavigateFunction;
    teams: Team[];
};

export const TeamCards = ({ navigateFn, teams }: TeamCardsProps) => {
    return (
        <div className='flex flex-col gap-4'>
            {teams.map((team) => (
                <Card
                    key={team.teamId}
                    className='hover:bg-gray-50 hover:cursor-pointer'
                    onClick={() => navigateFn(`/teams/${team.teamId}`)}
                >
                    <CardHeader>
                        <div className='flex flex-col gap-1.5'>
                            <h2 className='text-xl font-medium'>{team.name}</h2>
                            <p className='text-sm text-gray-500'>{team.description}</p>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-2 text-sm text-gray-500'>
                                <CalendarDaysIcon className='h-4 w-4' />
                                <p>
                                    Created:{' '}
                                    {new Date(parseInt(team.dateCreated)).toLocaleDateString()}
                                </p>
                            </div>
                            <div className='flex items-center gap-2 text-sm text-gray-500'>
                                <ArrowPathIcon className='h-4 w-4' />
                                <p>
                                    Last Modified:{' '}
                                    {new Date(parseInt(team.dateModified)).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};
