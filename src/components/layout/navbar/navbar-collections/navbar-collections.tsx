// navbar-collections.tsx
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu';
import { NavbarLink } from '@/components/layout/navbar/navbar-link';
import { getNavbarCollections } from './navbar-collections.data';

export async function NavbarCollections() {
  const collections = await getNavbarCollections();

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
}
