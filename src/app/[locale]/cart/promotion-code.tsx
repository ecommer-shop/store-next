"use client";

import { Button } from '@heroui/react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Tag } from 'lucide-react';
import { useActionState, useState } from 'react';
import { applyPromotionCode, removePromotionCode } from './actions';

export type PromotionCodeLabels = {
    title: string;
    description: string;
    placeholder: string;
    apply: string;
    remove: string;
    errorInvalid: string;
    errorExpired: string;
    errorLimit: string;
    errorNetwork: string;
};

export type PromotionCodeProps = {
    couponCodes?: string[] | null;
    labels: PromotionCodeLabels;
};

export function PromotionCode({ couponCodes, labels }: PromotionCodeProps) {
    const [state, formAction, pending] = useActionState(applyPromotionCode, null);
    const [removing, setRemoving] = useState(false);

    const errorMessage = !state?.success && state?.reason
        ? state.reason === 'invalid'
            ? labels.errorInvalid
            : state.reason === 'expired'
            ? labels.errorExpired
            : state.reason === 'limit'
            ? labels.errorLimit
            : labels.errorNetwork
        : null;

    return (
        <Card className="mt-4 lg:sticky lg:top-7">
            <CardHeader className="px-3 py-3 lg:px-6 lg:py-4">
                <CardTitle className="text-sm lg:text-lg flex items-center gap-2">
                    <Tag className="h-4 w-4 lg:h-5 lg:w-5" />
                    {labels.title}
                </CardTitle>
                <CardDescription className="text-xs lg:text-sm mt-1">
                    {labels.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-3 lg:px-6 lg:pb-6">
                {couponCodes && couponCodes.length > 0 ? (
                    <div className="space-y-2">
                        {couponCodes.map((code) => (
                            <div key={code}
                                 className="flex items-center justify-between p-2 lg:p-3 border rounded-md bg-green-50 dark:bg-green-950/20">
                                <div className="flex items-center gap-2">
                                    <Tag className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-green-600" />
                                    <span className="font-medium text-xs lg:text-sm">{code}</span>
                                </div>
                                <form
                                    action={async () => {
                                        setRemoving(true);
                                        const fd = new FormData();
                                        fd.set('code', code);
                                        await removePromotionCode(fd);
                                        setRemoving(false);
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="sm"
                                        isDisabled={removing}
                                        className="h-7 lg:h-8 text-xs lg:text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        {removing && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                                        {labels.remove}
                                    </Button>
                                </form>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <form action={formAction} className="flex gap-2">
                            <Input
                                type="text"
                                name="code"
                                placeholder={labels.placeholder}
                                className="flex-1 h-9 lg:h-10 text-sm"
                                required
                            />
                            <Button
                                type="submit"
                                isDisabled={pending}
                                className="h-9 lg:h-10 px-3 lg:px-4 text-xs lg:text-sm"
                            >
                                {pending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                                {labels.apply}
                            </Button>
                        </form>
                        {errorMessage && (
                            <p className="mt-2 text-xs lg:text-sm text-destructive">
                                {errorMessage}
                            </p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}