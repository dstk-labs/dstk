import { z } from 'zod';

import { useLogin } from '@/hooks';
import { Form, InputField } from '@/components/form';
import { Button } from '@/components/ui';

const loginInputSchema = z.object({
    password: z.string().min(1, 'Password is required.'),
    userName: z.string().min(1, 'Username is required.'),
});

type LoginInput = z.infer<typeof loginInputSchema>;

export const Login = () => {
    const [login, { loading }] = useLogin();

    const onSubmit = (data: LoginInput) => {
        login({
            variables: {
                data: {
                    password: data.password,
                    userName: data.userName,
                },
            },
        });
    };

    return (
        <section>
            <div className='container flex items-center justify-center min-h-screen px-6 mx-auto'>
                <div className='w-full max-w-md flex flex-col gap-8'>
                    <h1 className='text-2xl font-semibold text-gray-800 sm:text-3xl'>Sign In</h1>

                    <Form<LoginInput, typeof loginInputSchema>
                        id='login'
                        onSubmit={onSubmit}
                        schema={loginInputSchema}
                    >
                        {({ register, formState }) => (
                            <div className='flex flex-col gap-4'>
                                <InputField
                                    error={formState.errors.userName}
                                    placeholder='Username'
                                    registration={register('userName')}
                                    type='text'
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

                    <a
                        className='-mt-4 text-sm text-blue-600 hover:underline'
                        href='/reset-password'
                    >
                        Forgot password?
                    </a>

                    <div className='flex flex-col gap-6'>
                        <Button form='login' loading={loading} type='submit'>
                            Sign In
                        </Button>

                        <a href='/register' className='text-sm text-blue-600 hover:underline'>
                            Need to create an account? Click Here.
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
