import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

import { useListTeams } from './api';
import { TeamCards, TeamsHeader } from './components';

export const Teams = () => {
    const navigate = useNavigate();
    const { data, loading, error } = useListTeams();

    if (loading) {
        return <BarLoader color='#2563eb' width='250px' />;
    }

    if (error) {
        return <p>Unable to load teams</p>;
    }

    if (data && data.listTeams) {
        return (
            <div className='w-full flex flex-col gap-8'>
                <TeamsHeader navigateFn={navigate} />
                <TeamCards navigateFn={navigate} teams={data.listTeams} />
            </div>
        );
    }
};
