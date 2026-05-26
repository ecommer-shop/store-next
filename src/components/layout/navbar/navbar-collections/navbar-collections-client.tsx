
'use client';

import Link from 'next/link';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

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
                <Link href={`/collection/${collection.slug}`} legacyBehavior passHref>
                  <NavigationMenuLink className="block rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                    {collection.name}
                  </NavigationMenuLink>
                </Link>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      {featured.map((collection) => (
        <NavigationMenuItem key={collection.slug}>
          <Link href={`/collection/${collection.slug}`} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {collection.name}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
    </>
  );
}
