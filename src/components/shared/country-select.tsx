'use client';
import * as React from 'react';
import {
  ListBox,
  SearchField,
  Modal,
  Button,
  Key,
  SelectIndicator,
  Label,
  ScrollShadow,
} from '@heroui/react';
import { useEffect } from 'react';
import { I18N } from '@/i18n/keys';
import { useTranslations } from 'next-intl';

interface Country {
  id: string;
  code: string;
  name: string;
}

interface CountrySelectProps {
  countries: Country[];
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
}

export function CountrySelect({
  countries,
  disabled,
  value,
  onChange,
  onBlur,
  name,
}: CountrySelectProps) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const t = useTranslations('Account.addresses');
  const tr = I18N.Account.addresses.form.fields.countryCode
  // Asegurar que el scroll funcione
  useEffect(() => {
    if (open && scrollRef.current) {
      const element = scrollRef.current;

      // Forzar el foco en el contenedor scrollable
      element.focus();

      // Prevenir propagación de eventos de scroll
      const handleWheel = (e: WheelEvent) => {
        e.stopPropagation();
      };

      element.addEventListener('wheel', handleWheel, { passive: true });

      return () => {
        element.removeEventListener('wheel', handleWheel);
      };
    }
  }, [open]);

  const filteredCountries = React.useMemo(() => {
    if (!query) return countries;
    return countries.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [countries, query]);

  const selectedCountry = React.useMemo(() => {
    return countries.find(c => c.id === value);
  }, [countries, value]);

  const handleSelectionChange = (keys: Key | Set<Key> | null) => {
    if (!keys) return;
    const selectedKey = keys instanceof Set ? Array.from(keys)[0] : keys;
    if (selectedKey && onChange) {
      onChange(String(selectedKey));
      setOpen(false);
    }
    onBlur?.();
  };

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Button
        className="w-full justify-between"
        onPress={() => setOpen(true)}
        isDisabled={disabled}
      >
        <span className="text-foreground">
          {selectedCountry ? selectedCountry.name : t(tr.select)}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <path className='text-foreground' fill="currentColor" fillRule="evenodd" d="M13.03 10.53a.75.75 0 0 1-1.06 0L8 6.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06" clipRule="evenodd" />
        </svg>
      </Button>

      <Modal.Backdrop variant='blur' className="" style={{
        height: "100%"
      }}>

        <Modal.Container placement='center'>
          <Modal.Dialog className="bg-primary-foreground rounded-md w-full max-w-md">
            <Modal.CloseTrigger />
            <Modal.Heading className="px-6 pt-6 pb-2">
              {t(tr.select)}
            </Modal.Heading>

            <Modal.Body className="px-6 pb-6">
              <div className="flex flex-col gap-4">
                <SearchField
                  value={query}
                  onChange={setQuery}
                  aria-label="Search country"
                  className="w-full"
                >
                  <SearchField.Group>
                    <SearchField.SearchIcon className='text-foreground' fill='currentColor' />
                    <SearchField.Input
                      placeholder={t(tr.search)+"..."}
                      className="text-foreground"
                    />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>

                <div
                  ref={scrollRef}
                  tabIndex={0}
                  className="overflow-y-auto max-h-[50vh] -mx-2 px-2 focus:outline-none"
                  style={{
                    overscrollBehavior: 'contain',
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-y'
                  }}
                >
                  <ScrollShadow className='max-h-[50vh] p-4' size={80} orientation='vertical'>
                    <ListBox
                      aria-label="Country list"
                      items={filteredCountries}
                      selectedKeys={value ? new Set([value]) : new Set()}
                      selectionMode="single"
                      onSelectionChange={handleSelectionChange}
                    >
                      {(country) => (
                        <ListBox.Item key={country.id} textValue={country.name}>
                          <div className="flex text-foreground justify-between w-full">
                            <span>{country.name}</span>
                            <ListBox.ItemIndicator />
                          </div>
                        </ListBox.Item>
                      )}
                    </ListBox>
                  </ScrollShadow>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className='hidden md:flex'>
              <Button slot="close" variant="danger-soft"
                className="hover:bg-red-600 hover:text-primary-foreground
                 dark:hover:bg-red-600 dark:hover:text-primary
                 rounded-md">
                {t(tr.cancel)}
              </Button>
              <Button slot="close"
                className="rounded-md
                hover:bg-primary hover:text-primary-foreground">
                {t(tr.save)}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}