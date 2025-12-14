'use client';

import {use} from 'react';
import {VerifyResult} from './verify-result';
import {verifyAccountAction} from './actions';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {XCircle} from 'lucide-react';

interface VerifyContentProps {
    searchParams: Promise<{ token?: string }>;
}

export function VerifyContent({searchParams}: VerifyContentProps) {
    const params = use(searchParams);
    const token = params.token;

    if (!token) {
        return (
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-center">
                        <XCircle className="h-16 w-16 text-destructive"/>
                    </div>
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold">Invalid Verification Link</h1>
                        <p className="text-muted-foreground">
                            The verification link is invalid or missing a token.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Link href="/register" className="block">
                            <Button variant="ghost" className="w-full">
                                Create New Account
                            </Button>
                        </Link>
                        <Link href="/sign-in" className="block">
                            <Button variant="ghost" className="w-full">
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const verifyPromise = verifyAccountAction(token);

    return <VerifyResult resultPromise={verifyPromise}/>;
}
