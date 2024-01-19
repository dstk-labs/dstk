import { useNavigate } from 'react-router-dom';

import { BreadcrumbItem, Breadcrumbs, Button } from '@/components/ui';
import { Team } from '@/types/Team';

type TeamDetailsHeaderProps = {
    team: Team;
};

export const TeamDetailsHeader = ({ team }: TeamDetailsHeaderProps) => {
    const navigate = useNavigate();
    const { name, teamId } = team;

    return (
        <header className='flex flex-col gap-6'>
            <div>
                <Breadcrumbs>
                    <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                    <BreadcrumbItem href='/teams'>Teams</BreadcrumbItem>
                    <BreadcrumbItem href={`/teams/${teamId}`}>{name}</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className='flex items-center justify-between gap-0'>
                <h2 className='text-2xl font-medium text-gray-700 sm:text-3xl'>{name}</h2>
                <Button onClick={() => navigate(`/teams/${teamId}/add-member`)}>
                    Add Team Member
                </Button>
            </div>
        </header>
    );
};
