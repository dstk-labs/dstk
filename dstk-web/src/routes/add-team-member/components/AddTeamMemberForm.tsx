import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { useNotificationStore } from '@/stores';
import { Form, SelectField } from '@/components/form';
import { Button } from '@/components/ui';
import { ROLES } from '@/constants/roles';
import { User } from '@/types/User';

import { useAddTeamMember } from '../api';
import { NoUsersAvailable } from './NoUsersAvailable';

const addTeamMemberInputSchema = z.object({
    role: z.union([z.literal('member'), z.literal('owner'), z.literal('viewer')]),
    userId: z.string().min(1, 'Please select a user.'),
});

type AddTeamMemberInput = z.infer<typeof addTeamMemberInputSchema>;

type AddTeamMemberFormProps = {
    currentTeamMembers: User[];
    users: User[];
};

export const AddTeamMemberForm = ({ currentTeamMembers, users }: AddTeamMemberFormProps) => {
    const navigate = useNavigate();
    const { teamId } = useParams();

    const { addNotification } = useNotificationStore();

    const [addTeamMember, { loading }] = useAddTeamMember();

    const onSubmit = (data: AddTeamMemberInput) => {
        addTeamMember({
            variables: {
                data: {
                    role: data.role,
                    teamId: teamId,
                    userId: data.userId,
                },
            },
            onCompleted: () => {
                navigate(`/teams/${teamId}`);
                addNotification({
                    type: 'success',
                    title: 'Successfully added user',
                });
            },
        });
    };

    const usersNotJoined = users.filter(
        (user) => !currentTeamMembers.some((member) => member.userId === user.userId),
    );

    if (usersNotJoined.length > 0) {
        return (
            <>
                <Form<AddTeamMemberInput, typeof addTeamMemberInputSchema>
                    className='grid grid-cols-1 gap-x-6 gap-y-8 items-start sm:grid-cols-4'
                    id='add-team-member'
                    onSubmit={onSubmit}
                    schema={addTeamMemberInputSchema}
                >
                    {({ register, formState }) => (
                        <>
                            <div className='sm:col-span-2'>
                                <SelectField
                                    error={formState.errors.userId}
                                    label='User'
                                    options={usersNotJoined.map((user) => ({
                                        id: user.userId,
                                        label: user.userName,
                                        value: user.userId,
                                    }))}
                                    registration={register('userId')}
                                />
                            </div>
                            <div className='sm:col-span-2'>
                                <SelectField
                                    error={formState.errors.role}
                                    label='Role'
                                    options={ROLES}
                                    registration={register('role')}
                                />
                            </div>
                        </>
                    )}
                </Form>
                <div className='w-full flex items-center justify-end gap-4'>
                    <Button variant='secondary' onClick={() => navigate(`/teams/${teamId}/`)}>
                        Cancel
                    </Button>
                    <Button form='add-team-member' loading={loading} type='submit'>
                        Submit
                    </Button>
                </div>
            </>
        );
    }

    if (teamId) {
        return <NoUsersAvailable navigateFn={navigate} teamId={teamId} />;
    } else {
        return null;
    }
};
