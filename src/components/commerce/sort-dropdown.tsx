'use client';

import { Key, ListBox, Select } from "@heroui/react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import { useState } from "react";

const sortOptions = [
  { key: 'name-asc', label: 'Name: A to Z' },
  { key: 'name-desc', label: 'Name: Z to A' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
];

export function SortDropdown() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentSort = (searchParams.get('sort') ?? 'name-asc') as Key;

  const handleSortChange = (key: Key | null) => {
  if (!key) return;

  const params = new URLSearchParams(searchParams);
  params.set('sort', String(key));
  params.delete('page');
  router.push(`${pathname}?${params.toString()}`);
  };

    return (
        <Select 
            selectionMode="single"
            value={currentSort} 
            placeholder="Sort by"
            onChange={(value) => {handleSortChange(value);}}>
            <Select.Trigger className="w-[180px]">
                <Select.Value defaultValue="Name: A to Z" />
            </Select.Trigger>
            <Select.Popover className="rounded-sm">
                <ListBox>
                    {sortOptions.map((option) => (
                    <ListBox.Item key={option.key} id={option.key} textValue={option.label}>
                        {option.label}
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}
