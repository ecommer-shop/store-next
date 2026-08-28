'use client';

import { Home, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/vendure/shared/utils';
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import Image from 'next/image';

interface BottomNavProps {
  cartItemCount?: number;
}

export function BottomNav({ cartItemCount = 0 }: BottomNavProps) {
  const pathname = usePathname();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [showSearch, setShowSearch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Layout');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname.match(/^\/[a-z]{2}$/);
    }
    return pathname.includes(path);
  };

  const navItems = [
    {
      icon: Home,
      label: t(I18N.Layout.navbar.home),
      href: '/',
      active: isActive('/') && !pathname.includes('/cart') && !pathname.includes('/search') && !pathname.includes('/account'),
    },
    {
      icon: Search,
      label: t(I18N.Layout.navbar.search),
      href: '/search',
      active: isActive('/search'),
      onClick: () => setShowSearch(true),
    },
    {
      icon: ShoppingCart,
      label: t(I18N.Layout.navbar.cart),
      href: '/cart',
      active: isActive('/cart'),
      badge: cartItemCount > 0 ? cartItemCount : undefined,
    },
  ];

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-[0_-4px_20px_rgba(153,105,248,0.1)]">
        <div className="grid grid-cols-4 h-16 max-w-lg mx-auto px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <div
                className={cn(
                  'flex flex-col items-center justify-center gap-1 h-full relative transition-all duration-200',
                  item.active
                    ? 'text-[#9969F8]'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {/* Active Indicator */}
                {item.active && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-[#6BB8FF] to-[#9969F8]" />
                )}
                
                {/* Icon with badge */}
                <div className="relative">
                  <Icon
                    className={cn(
                      'w-6 h-6 transition-transform duration-200',
                      item.active && 'scale-110'
                    )}
                    strokeWidth={item.active ? 2.5 : 2}
                  />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-gradient-to-r from-[#6BB8FF] to-[#9969F8] text-white rounded-full px-1">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'text-[10px] font-medium transition-all duration-200',
                    item.active ? 'font-semibold' : 'font-normal'
                  )}
                >
                  {item.label}
                </span>
              </div>
            );

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={item.onClick}
                className="no-underline"
              >
                {content}
              </Link>
            );
          })}

          {/* User/Profile Button */}
          <SignedIn>
            <Link
              href="/account/profile"
              className={cn(
                'flex flex-col items-center justify-center gap-1 h-full relative transition-all duration-200 no-underline',
                isActive('/account')
                  ? 'text-[#9969F8]'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive('/account') && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-[#6BB8FF] to-[#9969F8]" />
              )}
              
              {/* Avatar del usuario */}
              {user?.imageUrl ? (
                <div className={cn(
                  'relative w-6 h-6 rounded-full overflow-hidden ring-2 transition-all duration-200',
                  isActive('/account') 
                    ? 'ring-[#9969F8] scale-110' 
                    : 'ring-transparent'
                )}>
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <User
                  className={cn(
                    'w-6 h-6 transition-transform duration-200',
                    isActive('/account') && 'scale-110'
                  )}
                  strokeWidth={isActive('/account') ? 2.5 : 2}
                />
              )}
              
              <span
                className={cn(
                  'text-[10px] font-medium transition-all duration-200',
                  isActive('/account') ? 'font-semibold' : 'font-normal'
                )}
              >
                {t(I18N.Layout.navbar.account)}
              </span>
            </Link>
          </SignedIn>

          <SignedOut>
            <button
              onClick={() => openSignIn()}
              className={cn(
                'flex flex-col items-center justify-center gap-1 h-full relative transition-all duration-200',
                'text-muted-foreground hover:text-foreground'
              )}
            >
              <User className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{t(I18N.Layout.navbar.signIn)}</span>
            </button>
          </SignedOut>
        </div>
      </nav>

      {/* Spacer for bottom nav on mobile */}
      <div className="h-16 md:hidden" />
    </>
  );
}
