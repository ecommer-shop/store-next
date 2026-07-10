
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
import { Bot, Users } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface NavbarCollectionsClientProps {
  collections: Collection[];
}

const navBtnBase =
  'flex items-center gap-1.5 h-9 px-3 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer select-none';

export function NavbarCollectionsClient({ collections }: NavbarCollectionsClientProps) {
  const rest = collections.slice(3);

  const openSimetriaChat = () => {
    window.dispatchEvent(new Event('open-simetria-chat'));
  };

  return (
    <>
      {/* Dropdown Categorías */}
      <NavigationMenuItem>
        <NavigationMenuTrigger>Categorías</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid grid-cols-2 gap-1 p-3 w-[320px]">
            {rest.map((collection) => (
              <li key={collection.slug}>
                <NavigationMenuLink
                  asChild
                  className="block rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
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

      {/* Botón SimetrIA */}
      <NavigationMenuItem className="flex items-center">
        <button
          onClick={openSimetriaChat}
          className={`${navBtnBase} text-[#6BB8FF] hover:bg-[#6BB8FF]/10 dark:hover:bg-[#6BB8FF]/15`}
        >
          <Bot size={14} />
          SimetrIA
        </button>
      </NavigationMenuItem>

      {/* Quiénes somos */}
      <NavigationMenuItem className="flex items-center">
        <Link
          href="/about-us"
          className={`${navBtnBase} text-[#9969F8] hover:bg-[#9969F8]/10 dark:hover:bg-[#9969F8]/15`}
        >
          <Users size={14} />
          Quiénes somos
        </Link>
      </NavigationMenuItem>
    </>
  );
}
