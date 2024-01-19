import { BreadcrumbItem, Breadcrumbs } from '@/components/ui';
import { Team } from '@/types/Team';

export type AddTeamMemberHeaderProps = {
    team: Team;
};

export const AddTeamMemberHeader = ({ team }: AddTeamMemberHeaderProps) => {
    const { name, teamId } = team;

    return (
        <header className='flex flex-col gap-6'>
            <div>
                <Breadcrumbs>
                    <BreadcrumbItem href='/dashboard/home'>Dashboard</BreadcrumbItem>
                    <BreadcrumbItem href='/teams'>Teams</BreadcrumbItem>
                    <BreadcrumbItem href={`/teams/${teamId}`}>{name}</BreadcrumbItem>
                    <BreadcrumbItem href={`/teams/${teamId}/add-member`}>
                        Add Team Member
                    </BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <h2 className='text-2xl font-medium text-gray-700 sm:text-3xl'>Add Team Member</h2>
        </header>
    );
};
