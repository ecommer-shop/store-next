import { RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export async function useAuth() {
    const user = auth();

    if (!(await user).isAuthenticated){
        return (<SignedOut>
                    <RedirectToSignIn />
                </SignedOut>)
    }
    return;
}