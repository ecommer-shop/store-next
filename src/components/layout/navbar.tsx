import Image from "next/image";
import Link from "next/link";
import {NavbarCollections} from '@/components/layout/navbar/navbar-collections/navbar-collections';
import {NavbarCart} from '@/components/layout/navbar/navbar-cart';
import {NavbarUser} from '@/components/layout/navbar/navbar-user';
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
                    <Link href="/" className="relative flex items-center w-[60px] h-6 flex-shrink-0">
                        {/* Light */}
                        <Image
                            src="/logo-dark.webp"
                            alt="Ecommer"
                            width={60}
                            height={60}
                            className="inset-0 h-6 w-auto block dark:hidden"
                            priority
                        />

                        {/* Dark */}
                        <Image
                            src="/logo-light.webp"
                            alt="Ecommer"
                            width={60}
                            height={60}
                            className="inset-0 h-6 w-auto hidden dark:block"
                            priority
                        />
                    </Link>

                    {/* Collections solo desktop */}
                    <nav className="hidden md:flex md:items-center md:gap-6">
                    <Suspense>
                        <NavbarCollections />
                    </Suspense>
                    </nav>
                </div>

                {/* DERECHA */}
                <div className="flex items-center gap-3 flex-1 justify-end min-w-0">

                    {/* Search ocupa todo en mobile */}
                    <div className="flex-1 min-w-0 sm:flex-none sm:w-[160px] md:w-[220px] lg:w-74">
                        <Suspense fallback={<SearchInputSkeleton />}>
                        <SearchInput />
                        </Suspense>
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