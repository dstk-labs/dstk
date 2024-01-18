import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Form, InputField, TextAreaField } from '@/components/form';
import { Button } from '@/components/ui';

import { useCreateTeam } from '../api';

const createTeamInputSchema = z.object({
    description: z.string().optional(),
    name: z.string().min(1, 'A team name is required.'),
});

type CreateTeamInput = z.infer<typeof createTeamInputSchema>;

export const CreateTeamForm = () => {
    const navigate = useNavigate();
    const [createTeam, { loading }] = useCreateTeam();

    const onSubmit = (data: CreateTeamInput) => {
        createTeam({
            variables: {
                data: {
                    description: data.description,
                    name: data.name,
                },
            },
        });
    };

    return (
        <>
            <Form<CreateTeamInput, typeof createTeamInputSchema>
                className='flex flex-col gap-8'
                id='create-team'
                onSubmit={onSubmit}
                schema={createTeamInputSchema}
            >
                {({ register, formState }) => (
                    <>
                        <div className='sm:basis-1/4'>
                            <InputField
                                error={formState.errors.name}
                                label='Team Name'
                                registration={register('name')}
                            />
                        </div>
                        <TextAreaField
                            error={formState.errors.description}
                            label='Description'
                            registration={register('description')}
                            rows={4}
                        />
                    </>
                )}
            </Form>
            <div className='w-full flex items-center justify-end gap-4'>
                <Button variant='secondary' onClick={() => navigate(`/dashboard/models/`)}>
                    Cancel
                </Button>
                <Button form='create-team' loading={loading} type='submit'>
                    Submit
                </Button>
            </div>
        </>
    );
};
