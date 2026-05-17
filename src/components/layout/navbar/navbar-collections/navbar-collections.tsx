import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu';
import { NavbarCollectionsClient } from './navbar-collections-client';
import { getNavbarCollections } from './navbar-collections.data';

export async function NavbarCollections() {
  const collections = await getNavbarCollections();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {collections.map((collection) => (
          <NavigationMenuItem key={collection.slug}>
            <NavbarCollectionsClient name={collection.name} slug={collection.slug} />
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
