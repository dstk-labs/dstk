import { z } from 'zod';

import { useLogin } from '@/hooks';
import { Form, InputField } from '@/components/form';
import { Button } from '@/components/ui';

import { useCreateAccount } from './api/createAccount';
import { useNotificationStore } from '@/stores';

const createAccountSchema = z.object({
    email: z.string().email().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
    realName: z.string().min(1, 'Name is required'),
    userName: z.string().min(1, 'Username is required'),
});

type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const Register = () => {
    const [createAccount, { loading: createAccountLoading }] = useCreateAccount();
    const [login, { loading: loginLoading }] = useLogin();

    const { addNotification } = useNotificationStore();

    const onSubmit = (data: CreateAccountInput) => {
        createAccount({
            variables: {
                data: {
                    email: data.email,
                    password: data.password,
                    realName: data.realName,
                    userName: data.userName,
                },
            },
            onCompleted: () => {
                login({
                    variables: {
                        data: {
                            userName: data.userName,
                            password: data.password,
                        },
                    },
                });
                addNotification({
                    type: 'success',
                    title: 'Successfully created account!',
                    children: 'A verification code has been sent to your email.',
                });
            },
        });
    };

    return (
        <section>
            <div className='container flex items-center justify-center min-h-screen px-6 mx-auto'>
                <div className='w-full max-w-md flex flex-col gap-8'>
                    <h1 className='text-2xl font-semibold text-gray-800 sm:text-3xl'>
                        Create an Account
                    </h1>

                    <Form<CreateAccountInput, typeof createAccountSchema>
                        id='create-account'
                        onSubmit={onSubmit}
                        schema={createAccountSchema}
                    >
                        {({ register, formState }) => (
                            <div className='flex flex-col gap-4'>
                                <InputField
                                    error={formState.errors.realName}
                                    placeholder='Name'
                                    registration={register('realName')}
                                    type='text'
                                />
                                <InputField
                                    error={formState.errors.userName}
                                    placeholder='Username'
                                    registration={register('userName')}
                                    type='text'
                                />
                                <InputField
                                    error={formState.errors.email}
                                    placeholder='Email'
                                    registration={register('email')}
                                    type='email'
                                />
                                <InputField
                                    error={formState.errors.password}
                                    placeholder='Password'
                                    registration={register('password')}
                                    type='password'
                                />
                            </div>
                        )}
                    </Form>

                    <div className='flex flex-col gap-6'>
                        <Button
                            form='create-account'
                            loading={createAccountLoading || loginLoading}
                            type='submit'
                        >
                            Create Account
                        </Button>

                        <a href='/login' className='text-sm text-blue-600 hover:underline'>
                            Already have an account? Sign in here.
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
