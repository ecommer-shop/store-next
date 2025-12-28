import {cacheLife, unstable_cache} from 'next/cache';
import {getTopCollections} from '@/lib/vendure/cached';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
} from '@/components/ui/navigation-menu';
import {NavbarLink} from '@/components/layout/navbar/navbar-link';

export const NavbarCollections = () => 
    unstable_cache(
        async () => {
            /*"use cache";
            cacheLife('days');*/

            const collections = await getTopCollections();

            return (
                <NavigationMenu>
                    <NavigationMenuList>
                        {collections.map((collection) => (
                            <NavigationMenuItem key={collection.slug}>
                                <NavbarLink href={`/collection/${collection.slug}`}>
                                    {collection.name}
                                </NavbarLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
            );
        },
        [],
        {
            revalidate: 72 * 3600
        }
)()
