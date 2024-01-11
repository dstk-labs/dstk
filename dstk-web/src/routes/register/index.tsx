import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useNotificationStore } from '@/stores';
import { Button, Input } from '@/components/ui';

import { useCreateAccount } from './api/createAccount';

const createAccountSchema = z.object({
    email: z.string().email().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
    realName: z.string().min(1, 'Name is required'),
    userName: z.string().min(1, 'Username is required'),
});

type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const Register = () => {
    const [createAccount, { loading }] = useCreateAccount();

    const { register, handleSubmit } = useForm<CreateAccountInput>({
        resolver: zodResolver(createAccountSchema),
    });

    const onSubmit: SubmitHandler<CreateAccountInput> = (data) => {
        createAccount({
            variables: {
                data: {
                    email: data.email,
                    password: data.password,
                    realName: data.realName,
                    userName: data.userName,
                },
            },
            onCompleted: () =>
                addNotification({
                    type: 'success',
                    title: 'Successfully created account!',
                    children: 'A verification code has been sent to your email.',
                }),
            onError: (error) =>
                addNotification({
                    type: 'error',
                    title: 'Error',
                    children: error.message,
                }),
        });
    };

    const { addNotification } = useNotificationStore();

    return (
        <section>
            <div className='container flex items-center justify-center min-h-screen px-6 mx-auto'>
                <form
                    className='w-full max-w-md flex flex-col gap-8'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className='text-2xl font-semibold text-gray-800 sm:text-3xl'>
                        Create an Account
                    </h1>

                    <div className='flex flex-col gap-4'>
                        <Input placeholder='Name' type='text' {...register('realName')} />

                        <Input placeholder='Username' type='text' {...register('userName')} />

                        <Input placeholder='Email' type='email' {...register('email')} />

                        <Input placeholder='Password' type='password' {...register('password')} />
                    </div>

                    <div className='flex flex-col gap-6'>
                        <Button className='w-full' loading={loading} type='submit'>
                            Create Account
                        </Button>

                        <a href='/login' className='text-sm text-blue-600 hover:underline'>
                            Already have an account? Sign in here.
                        </a>
                    </div>
                </form>
            </div>
        </section>
    );
};
