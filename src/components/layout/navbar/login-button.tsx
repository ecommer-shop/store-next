'use client'

import {ComponentProps, useTransition} from "react";
import {logoutAction} from "@/app/sign-in/actions";
import {useRouter} from "next/navigation";
import { Button } from "@heroui/react";
//import { auth0 } from "@/lib/auth0";

interface LoginButtonProps extends ComponentProps<'button'> {
    isLoggedIn: boolean;
}

export function LoginButton({isLoggedIn, ...props}: LoginButtonProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    //const session = await auth0.getSession();

    // agregar aria-disabled={isPending} despues de {...props}
    

    return (
        <button {...props}
                onClick={() => {
                    if (isLoggedIn) {
                        startTransition(async () => {
                            await logoutAction()
                        })
                    } else {
                        router.push('/sign-in')
                    }
                }}>
            {isLoggedIn ? 'Sign out' : 'Sign in'}
        </button>
    )
}