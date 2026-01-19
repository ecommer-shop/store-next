'use client';

import * as React from 'react';
import {
  Select,
  ListBox,
  SearchField,
  Collection,
} from '@heroui/react';

interface Country {
  code: string;
  name: string;
}

interface CountrySelectProps {
  countries: Country[];
  disabled?: boolean;
}

export function CountrySelect({
  countries,
  disabled,
}: CountrySelectProps) {
  const [query, setQuery] = React.useState('');

  const filteredCountries = React.useMemo(() => {
    if (!query) return countries;
    return countries.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [countries, query]);

  return (
    <Select
      className="w-full text-foreground"
      isDisabled={disabled}
      selectionMode="single"
      placeholder="Select country"
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>

      <Select.Popover>
        <div className="p-2">
          <SearchField
            value={query}
            onChange={setQuery}
            aria-label="Search country"
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search country..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
        </div>

        <ListBox>
          <Collection items={filteredCountries}>
            {(country) => (
              <ListBox.Item
                key={country.code}
                textValue={country.name}
              >
                {country.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </Collection>
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
