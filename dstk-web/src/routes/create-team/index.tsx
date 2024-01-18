import { CreateTeamForm, CreateTeamHeader } from './components';

export const CreateTeam = () => {
    return (
        <div className='w-full flex flex-col gap-8'>
            <CreateTeamHeader />
            <CreateTeamForm />
        </div>
    );
};
