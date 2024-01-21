import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

import { useListTeamMembers, useListTeams } from '@/hooks';

import { TeamDetailsHeader, TeamDetailsTable } from './components';

export const TeamDetails = () => {
    const { teamId } = useParams();

    const { data: teamData, loading: teamLoading, error: teamError } = useListTeams(teamId);
    const {
        data: teamMembersData,
        loading: teamMembersLoading,
        error: teamMembersError,
    } = useListTeamMembers(teamId || '');

    if (teamLoading || teamMembersLoading) {
        return <BarLoader color='#2563eb' width='250px' />;
    }

    if (teamError || teamMembersError) {
        return <p>Error retrieving team data</p>;
    }

    if (teamData && teamData.listTeams && teamMembersData && teamMembersData.listTeamMembers) {
        return (
            <div className='w-full flex flex-col gap-8'>
                <TeamDetailsHeader team={teamData.listTeams[0]} />
                <TeamDetailsTable teamMembers={teamMembersData.listTeamMembers} />
            </div>
        );
    }
};
