import { zodResolver } from '@hookform/resolvers/zod';
import { useSetAtom } from 'jotai';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useNotificationStore } from '@/stores';

import { jwtAtom } from '@/atoms';

import { Button, Input } from '@/components/ui';

import { useLogin } from './api/useLogin';

const loginInputSchema = z.object({
    password: z.string().min(1, 'Password is required.'),
    userName: z.string().min(1, 'Username is required.'),
});

type LoginInput = z.infer<typeof loginInputSchema>;

export const Login = () => {
    const setToken = useSetAtom(jwtAtom);

    const navigate = useNavigate();

    const [login] = useLogin();

    const { register, handleSubmit } = useForm<LoginInput>({
        resolver: zodResolver(loginInputSchema),
    });

    const { addNotification } = useNotificationStore();

    const onSubmit: SubmitHandler<LoginInput> = (data) => {
        login({
            variables: {
                data: {
                    password: data.password,
                    userName: data.userName,
                },
            },
            onCompleted: (data) => {
                setToken(data.login);
                navigate('/dashboard/home');
            },
            onError: (error) =>
                addNotification({
                    type: 'error',
                    title: 'Error',
                    children: error.message,
                }),
        });
    };

    return (
        <section>
            <div className='container flex items-center justify-center min-h-screen px-6 mx-auto'>
                <form className='w-full max-w-md' onSubmit={handleSubmit(onSubmit)}>
                    <div className='mt-3'>
                        <h1 className='text-2xl font-semibold text-gray-800 sm:text-3xl'>
                            Sign In
                        </h1>
                    </div>

                    <div className='mt-8'>
                        <Input placeholder='Username' type='text' {...register('userName')} />
                    </div>

                    <div className='mt-4'>
                        <Input placeholder='Password' type='password' {...register('password')} />
                    </div>

                    <a
                        href='/reset-password'
                        className='inline-block mt-4 text-sm text-indigo-600 hover:underline'
                    >
                        Forgot password?
                    </a>

                    <div className='mt-6'>
                        <Button className='w-full' size='lg' type='submit'>
                            Sign In
                        </Button>

                        <div className='mt-6 text-center '>
                            <a href='/register' className='text-sm text-indigo-600 hover:underline'>
                                Don’t have an account yet? Sign up
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};
