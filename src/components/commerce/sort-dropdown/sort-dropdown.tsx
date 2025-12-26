"use client";

import type { Key } from "react-aria-components";
import { Label, ListBox, Select } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const sortOptions = [
  { id: "name-asc", name: "Nombre: A a Z" },
  { id: "name-desc", name: "Nombre: Z a A" },
  { id: "price-asc", name: "Precio: Bajo a Alto" },
  { id: "price-desc", name: "Precio: Alto a Bajo" },
];

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  return (
    <Select
      className="w-[180px] rounded-md"
      value={sort}
      onChange={handleChange}
      placeholder="Sort by"
    >
      <Label>Ordenar Por:</Label>

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
