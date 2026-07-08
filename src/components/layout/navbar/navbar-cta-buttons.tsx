'use client';

import { useClerk, SignedOut } from '@clerk/nextjs';
import { getSellersLandingUrl } from '@/lib/sellers-landing-url';
import { trackSignup } from '@/lib/analytics/events';
import { Store, UserPlus } from 'lucide-react';

export function NavbarCtaButtons() {
    const { openSignUp } = useClerk();
    const sellersLandingUrl = getSellersLandingUrl();

    return (
        <SignedOut>
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                {/* Registrarse */}
                <button
                    onClick={() => {
                        trackSignup({ method: 'Clerk/Modal' });
                        openSignUp();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-[#6BB8FF]/60 text-[#6BB8FF] hover:bg-[#6BB8FF]/10 transition-colors duration-200 whitespace-nowrap"
                >
                    <UserPlus size={13} />
                    Registrarse
                </button>

                {/* Crea tu tienda */}
                <button
                    onClick={() => window.location.assign(sellersLandingUrl)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-colors duration-200 whitespace-nowrap"
                    style={{ background: 'linear-gradient(90deg, #6BB8FF, #9969F8)' }}
                >
                    <Store size={13} />
                    Crea tu tienda
                </button>
            </div>
        </SignedOut>
    );
}
