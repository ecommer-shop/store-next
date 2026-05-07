'use client';

import { useRouter } from 'next/navigation';
import { NavbarLink } from '../navbar-link';
import { Button } from '@heroui/react';

interface NavbarCollectionsClientProps {
  name: string;
  slug: string;
}

export function NavbarCollectionsClient({ name, slug }: NavbarCollectionsClientProps) {
  const router = useRouter();

  const handleCollectionClick = () => {
    // Redirect to search page with collection filter
    router.push(`/search?collection=${slug}`);
  };

  return (
    <button
      onClick={handleCollectionClick}
      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
    >
      {name}
    </button>
  );
}
