'use client';

import {useState, useTransition} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {loginAction} from './actions';
import {Button} from '@heroui/react';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';

const loginSchema = z.object({
    username: z.email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    redirectTo?: string;
}

export function LoginForm({redirectTo}: LoginFormProps) {
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormData) => {
        setServerError(null);

        startTransition(async () => {
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('password', data.password);
            if (redirectTo) {
                formData.append('redirectTo', redirectTo);
            }

            const result = await loginAction(undefined, formData);
            if (result?.error) {
                setServerError(result.error);
            }
        });
    };

    const registerHref = redirectTo
        ? `/register?redirectTo=${encodeURIComponent(redirectTo)}`
        : '/register';

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            disabled={isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <Link
                                            href="/forgot-password"
                                            className="text-muted-foreground hover:text-primary text-sm"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            disabled={isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {serverError && (
                            <div className="text-sm text-destructive">
                                {serverError}
                            </div>
                        )}
                        <Button type="submit" className="w-full" isDisabled={isPending}>
                            {isPending ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 mt-2">
                        <div className="text-muted-foreground text-sm text-center">
                            Don&apos;t have an account?{' '}
                            <Link href={registerHref} className="hover:text-primary underline">
                                Register
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
