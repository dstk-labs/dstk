import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

import { useListTeamMembers, useListTeams } from '@/hooks';

import { AddTeamMemberForm, AddTeamMemberHeader } from './components';
import { useListUsers } from './api';

export const AddTeamMember = () => {
    const { teamId } = useParams();

    const { data: team, loading: teamLoading, error: teamError } = useListTeams(teamId);
    const {
        data: currentTeamMembers,
        loading: currentTeamMembersLoading,
        error: currentTeamMembersError,
    } = useListTeamMembers(teamId || '');
    const { data: user, loading: userLoading, error: userError } = useListUsers();

    if (currentTeamMembersError || teamError || userError) {
        return <p>Error loading team information.</p>;
    }

    if (currentTeamMembersLoading || teamLoading || userLoading) {
        return <BarLoader color='#2563eb' width='250px' />;
    }

    if (
        currentTeamMembers &&
        currentTeamMembers.listTeamMembers &&
        team &&
        team.listTeams &&
        user &&
        user.listUsers
    ) {
        return (
            <div className='w-full flex flex-col gap-8'>
                <AddTeamMemberHeader team={team.listTeams[0]} />
                <AddTeamMemberForm
                    currentTeamMembers={currentTeamMembers.listTeamMembers}
                    users={user.listUsers}
                />
            </div>
        );
    } else {
        return null;
    }
};
