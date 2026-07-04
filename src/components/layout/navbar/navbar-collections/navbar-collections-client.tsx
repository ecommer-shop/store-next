
'use client';

import Link from 'next/link';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { trackClickCategory } from '@/lib/analytics/events';

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface NavbarCollectionsClientProps {
  collections: Collection[];
}

export function NavbarCollectionsClient({ collections }: NavbarCollectionsClientProps) {
  const featured = collections.slice(0, 3);
  const rest = collections.slice(3);

  return (
    <>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Categorías</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid grid-cols-2 gap-1 p-3 w-[320px]">
            {rest.map((collection) => (
              <li key={collection.slug}>
                <NavigationMenuLink asChild className="block rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                  {/* Primer Link: Categorías del menú desplegable */}
                  <Link 
                    href={`/collection/${collection.slug}`}
                    onClick={() => trackClickCategory({ category_name: collection.name })}
                  >
                    {collection.name}
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      {featured.map((collection) => (
        <NavigationMenuItem key={collection.slug}>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            {/* Segundo Link: Categorías destacadas principales */}
            <Link 
              href={`/collection/${collection.slug}`}
              onClick={() => trackClickCategory({ category_name: collection.name })}
            >
              {collection.name}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </>
  );
}
