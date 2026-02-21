"use client";

import Link from 'next/link';
import { Button } from '@heroui/react';
import { useSelectedItems } from './selected-items-context';
import React from 'react';

export default function CheckoutButtonClient({ label }: { label: string }) {
  const { selectedLineIds } = useSelectedItems();

  const isDisabled = selectedLineIds.length === 0;

  return (
    <Button className="w-full" size="lg" isDisabled={isDisabled}>
      <Link className="w-full" href="/checkout">
        {label}
      </Link>
    </Button>
  );
}
