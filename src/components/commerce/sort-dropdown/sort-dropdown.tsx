"use client";

import type { Key } from "react-aria-components";
import { Label, ListBox, Select } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { I18N } from "@/i18n/keys";

const getSortOptions = (t: (key: string) => string) => [
  { id: "name-asc", name: t(I18N.Commerce.sortDropdown.nameAsc) },
  { id: "name-desc", name: t(I18N.Commerce.sortDropdown.nameDesc) },
  { id: "price-asc", name: t(I18N.Commerce.sortDropdown.priceAsc) },
  { id: "price-desc", name: t(I18N.Commerce.sortDropdown.priceDesc) },
];

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Commerce");

  const [sort, setSort] = useState<Key | null>(null);

  // 🔹 solo hidrata desde la URL
  useEffect(() => {
    setSort(searchParams.get("sort") ?? "name-asc");
  }, []);

  const handleChange = (value: Key | null) => {
    if (!value) return;

    setSort(value);

    const params = new URLSearchParams(searchParams);
    params.set("sort", String(value));
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  if (!sort) return null;

  const sortOptions = getSortOptions(t);

  return (
    <Select
      className="w-[180px] rounded-md"
      value={sort}
      onChange={handleChange}
      placeholder={t(I18N.Commerce.sortDropdown.sort)}
    >
      <Label>{t(I18N.Commerce.sortDropdown.sort)}:</Label>

      <Select.Trigger className="rounded-md">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>

      <Select.Popover className="rounded-md">
        <ListBox>
          {sortOptions.map((option) => (
            <ListBox.Item
              key={option.id}
              id={option.id}
              textValue={option.name}
            >
              {option.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
