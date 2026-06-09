import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu';
import { NavbarCollectionsClient } from './navbar-collections-client';
import { getNavbarCollections } from './navbar-collections.data';

export async function NavbarCollections() {
  const collections = await getNavbarCollections();
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavbarCollectionsClient collections={collections} />
      </NavigationMenuList>
    </NavigationMenu>
  );
}