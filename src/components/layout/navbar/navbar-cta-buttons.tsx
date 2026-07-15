'use client';

import { useClerk, SignedOut, SignedIn } from '@clerk/nextjs';
import { getSellersLandingUrl } from '@/lib/sellers-landing-url';
import { trackSignup } from '@/lib/analytics/events';
import { Store, UserPlus } from 'lucide-react';

export function NavbarCtaButtons() {
    const { openSignUp } = useClerk();
    const sellersLandingUrl = getSellersLandingUrl();

    return (
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* Registrarse - Solo cuando NO está logueado */}
            <SignedOut>
                <button
                    onClick={() => {
                        trackSignup({ method: 'Clerk/Modal' });
                        openSignUp();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-[#6BB8FF]/60 text-[#6BB8FF] hover:bg-[#6BB8FF]/10 transition-colors duration-200 whitespace-nowrap cursor-pointer"
                >
                    <UserPlus size={13} />
                    Registrarse
                </button>
            </SignedOut>

            {/* Crea tu tienda - Siempre visible */}
            <button
                onClick={() => window.location.assign(sellersLandingUrl)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-colors duration-200 whitespace-nowrap cursor-pointer"
                style={{ background: 'linear-gradient(90deg, #6BB8FF, #9969F8)' }}
            >
                <Store size={13} />
                Crea tu tienda
            </button>
        </div>
    );
}
