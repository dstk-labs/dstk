import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

import { useListTeams } from '@/hooks';

import { AddTeamMemberForm, AddTeamMemberHeader } from './components';
import { useListUsers } from './api';

export const AddTeamMember = () => {
    const { teamId } = useParams();

    const { data: teamsData, loading: teamsLoading, error: teamsError } = useListTeams(teamId);
    const { data: usersData, loading: usersLoading, error: usersError } = useListUsers();

    if (teamsError || usersError) {
        return <p>Error loading team information.</p>;
    }

    if (teamsLoading || usersLoading) {
        return <BarLoader color='#2563eb' width='250px' />;
    }

    if (teamsData && teamsData.listTeams && usersData && usersData.listUsers) {
        return (
            <div className='w-full flex flex-col gap-8'>
                <AddTeamMemberHeader team={teamsData.listTeams[0]} />
                <AddTeamMemberForm users={usersData.listUsers} />
            </div>
        );
    } else {
        return null;
    }
};
