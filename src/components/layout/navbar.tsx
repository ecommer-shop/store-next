import Image from "next/image";
import Link from "next/link";
import {NavbarCollections} from '@/components/layout/navbar/navbar-collections';
import {NavbarCart} from '@/components/layout/navbar/navbar-cart';
import {NavbarUser} from '@/components/layout/navbar/navbar-user';
import {ThemeSwitcher} from '@/components/layout/navbar/theme-switcher';
import {Suspense} from "react";
import {SearchInput} from '@/components/layout/search-input';
import {NavbarUserSkeleton} from '@/components/shared/skeletons/navbar-user-skeleton';
import {SearchInputSkeleton} from '@/components/shared/skeletons/search-input-skeleton';

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
            <div className="container mx-auto px-4">
                
                <div className="flex items-center h-16 gap-3 md:justify-between">
                
                {/* IZQUIERDA */}
                <div className="flex items-center gap-6 flex-shrink-0">
                    <Link href="/" className="text-xl font-bold flex-shrink-0">
                    <Image
                        src="/vendure.svg"
                        alt="Vendure"
                        width={40}
                        height={27}
                        className="h-6 w-auto dark:invert"
                    />
                    </Link>

                    {/* Collections solo desktop */}
                    <nav className="hidden md:flex items-center gap-6">
                    <Suspense>
                        <NavbarCollections />
                    </Suspense>
                    </nav>
                </div>

                {/* DERECHA */}
                <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                    
                    {/* Search siempre visible */}
                    <div className="w-[120px] sm:w-[160px] md:w-[220px] lg:w-64">
                    <Suspense fallback={<SearchInputSkeleton />}>
                        <SearchInput />
                    </Suspense>
                    </div>

                    {/* Theme solo tablet+ */}
                    <div className="hidden md:flex">
                    <ThemeSwitcher />
                    </div>

                    <Suspense>
                    <NavbarCart />
                    </Suspense>

                    <Suspense fallback={<NavbarUserSkeleton />}>
                    <NavbarUser />
                    </Suspense>
                </div>
                </div>
            </div>
        </header>
    );
}