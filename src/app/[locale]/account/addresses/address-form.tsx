'use client';

import { Button, FieldError, Form, Label, TextField } from '@heroui/react';
import { Input } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { CountrySelect } from '@/components/shared/country-select';
import {
  GoogleAddressAutocomplete,
  GoogleAddressSelection,
  GoogleLocationMapPreview,
} from '@/components/shared/google-address-autocomplete';
import { useCallback, useState } from 'react';

export interface Country {
  id: string;
  code: string;
  name: string;
}

export interface AddressGeoCustomFields {
  [key: string]: unknown;
  latitude?: number | null;
  longitude?: number | null;
  neighborhood?: string | null;
  googlePlaceId?: string | null;
}

export interface AddressFormData {
  fullName: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
  phoneNumber: string;
  company?: string;
  customFields?: AddressGeoCustomFields;
}

interface AddressFormProps {
  countries: Country[];
  defaultValues?: Partial<AddressFormData>;
  googleMapsApiKey?: string;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  requireGoogleCoordinates?: boolean;
  labels: {
    fullName: string;
    company: string;
    streetLine1: string;
    streetLine2: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    cancel?: string;
    submit: string;
  };
}

function normalizeCoordinate(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

function hasUsableCoordinates(latitude: number | null, longitude: number | null) {
  return latitude !== null && longitude !== null && !(latitude === 0 && longitude === 0);
}

export function AddressForm({
  countries,
  defaultValues,
  googleMapsApiKey,
  onSubmit,
  onCancel,
  isSubmitting = false,
  requireGoogleCoordinates = false,
  labels,
}: AddressFormProps) {
  const { register, handleSubmit, control, formState: { errors }, setValue, getValues, watch } =
    useForm<AddressFormData>({
      defaultValues: {
        countryCode: countries[0]?.id ?? 'CO',
        ...defaultValues,
      },
    });
  const geoFields = watch('customFields');
  const selectedStreetLine = watch('streetLine1');
  const [geoError, setGeoError] = useState<string | null>(null);
  const hasGoogleMapsApiKey = Boolean(googleMapsApiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  const handleGoogleAddressSelect = useCallback((selection: GoogleAddressSelection) => {
    const selectedAddress = selection.formattedAddress || selection.streetLine1;

    if (selectedAddress) {
      setValue('streetLine1', selectedAddress, { shouldDirty: true, shouldValidate: true });
    }
    if (selection.city) {
      setValue('city', selection.city, { shouldDirty: true, shouldValidate: true });
    }
    if (selection.province) {
      setValue('province', selection.province, { shouldDirty: true, shouldValidate: true });
    }
    if (selection.postalCode) {
      setValue('postalCode', selection.postalCode, { shouldDirty: true, shouldValidate: true });
    }
    if (selection.countryCode) {
      const country = countries.find(
        item => item.code.toLowerCase() === selection.countryCode?.toLowerCase(),
      );
      if (country) {
        setValue('countryCode', country.id, { shouldDirty: true, shouldValidate: true });
      }
    }

    setValue(
      'customFields',
      {
        ...getValues('customFields'),
        latitude: selection.latitude,
        longitude: selection.longitude,
        neighborhood: selection.neighborhood || null,
        googlePlaceId: selection.googlePlaceId || null,
      },
      { shouldDirty: true, shouldValidate: true },
    );
    setGeoError(null);
  }, [countries, getValues, setValue]);

  const handleStreetLineManualChange = useCallback((value: string) => {
    setValue('streetLine1', value, { shouldDirty: true, shouldValidate: true });
    setValue(
      'customFields',
      {
        ...getValues('customFields'),
        latitude: null,
        longitude: null,
        neighborhood: null,
        googlePlaceId: null,
      },
      { shouldDirty: true, shouldValidate: true },
    );
    setGeoError(null);
  }, [getValues, setValue]);

  const latitude = normalizeCoordinate(geoFields?.latitude);
  const longitude = normalizeCoordinate(geoFields?.longitude);
  const hasValidCoordinates = hasUsableCoordinates(latitude, longitude);

  const submitForm = handleSubmit(async (data) => {
    const latitude = normalizeCoordinate(data.customFields?.latitude);
    const longitude = normalizeCoordinate(data.customFields?.longitude);
    const hasCoordinates = hasUsableCoordinates(latitude, longitude);

    if (requireGoogleCoordinates && !hasCoordinates) {
      setGeoError('Selecciona una direccion desde Google Maps para guardar sus coordenadas.');
      return;
    }

    await onSubmit({
      ...data,
      customFields: hasCoordinates
        ? {
            ...data.customFields,
            latitude,
            longitude,
          }
        : undefined,
    });
  });

  return (
    <Form onSubmit={submitForm}>
      {/* Hidden geo fields */}
      <input type="hidden" {...register('customFields.latitude')} />
      <input type="hidden" {...register('customFields.longitude')} />
      <input type="hidden" {...register('customFields.neighborhood')} />
      <input type="hidden" {...register('customFields.googlePlaceId')} />
      {/* company hidden — not needed for individual buyers */}
      <input type="hidden" {...register('company')} />

      <div className="space-y-5">

        {/* Nombre completo */}
        <TextField>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
            {labels.fullName} <span className="text-[#9969F8]">*</span>
          </Label>
          <Input
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
            autoComplete="name"
            {...register('fullName', { required: labels.fullName })}
          />
          <FieldError className="text-xs text-red-500 mt-1">{errors.fullName?.message}</FieldError>
        </TextField>

        {/* Dirección principal */}
        {hasGoogleMapsApiKey ? (
          <div>
            <Controller
              name="streetLine1"
              control={control}
              rules={{ required: labels.streetLine1 }}
              render={({ field }) => (
                <GoogleAddressAutocomplete
                  label={`${labels.streetLine1} *`}
                  placeholder="Escribe y selecciona una dirección de Google Maps"
                  apiKey={googleMapsApiKey}
                  value={field.value ?? ''}
                  inputName={field.name}
                  className=""
                  onValueChange={handleStreetLineManualChange}
                  onSelect={handleGoogleAddressSelect}
                />
              )}
            />
            <FieldError className="text-xs text-red-500 mt-1">{errors.streetLine1?.message}</FieldError>
          </div>
        ) : (
          <>
            <TextField>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
                {labels.streetLine1} <span className="text-[#9969F8]">*</span>
              </Label>
              <Input
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
                autoComplete="address-line1"
                {...register('streetLine1', { required: labels.streetLine1 })}
              />
              <FieldError className="text-xs text-red-500 mt-1">{errors.streetLine1?.message}</FieldError>
            </TextField>
          </>
        )}

        {/* Coordenadas confirmadas */}
        {hasValidCoordinates && latitude !== null && longitude !== null && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300">
            <p className="font-semibold flex items-center gap-1.5">
              <span>✅</span> Dirección verificada con Google Maps
            </p>
            {selectedStreetLine && (
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">{selectedStreetLine}</p>
            )}
            {geoFields?.neighborhood && (
              <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-500">Barrio: {geoFields.neighborhood}</p>
            )}
            <GoogleLocationMapPreview
              apiKey={googleMapsApiKey}
              latitude={latitude}
              longitude={longitude}
              address={selectedStreetLine}
            />
          </div>
        )}

        {/* Geo error */}
        {geoError && (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {geoError}
          </div>
        )}

        {/* Apartamento / Suite */}
        <TextField>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
            {labels.streetLine2}
          </Label>
          <Input
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
            placeholder="Apto, piso, oficina…"
            {...register('streetLine2')}
          />
        </TextField>

        {/* Ciudad + Departamento */}
        <div className="grid grid-cols-2 gap-4">
          <TextField>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
              {labels.city} <span className="text-[#9969F8]">*</span>
            </Label>
            <Input
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
              {...register('city', { required: labels.city })}
            />
            <FieldError className="text-xs text-red-500 mt-1">{errors.city?.message}</FieldError>
          </TextField>

          <TextField>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
              {labels.province} <span className="text-[#9969F8]">*</span>
            </Label>
            <Input
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
              {...register('province', { required: labels.province })}
            />
            <FieldError className="text-xs text-red-500 mt-1">{errors.province?.message}</FieldError>
          </TextField>
        </div>

        {/* Código postal + País */}
        <div className="grid grid-cols-2 gap-4">
          <TextField>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
              {labels.postalCode} <span className="text-[#9969F8]">*</span>
            </Label>
            <Input
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
              {...register('postalCode', { required: labels.postalCode })}
            />
            <FieldError className="text-xs text-red-500 mt-1">{errors.postalCode?.message}</FieldError>
          </TextField>

          <TextField>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
              {labels.country} <span className="text-[#9969F8]">*</span>
            </Label>
            <Controller
              name="countryCode"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CountrySelect
                  countries={countries}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <FieldError className="text-xs text-red-500 mt-1">{errors.countryCode?.message}</FieldError>
          </TextField>
        </div>

        {/* Teléfono */}
        <TextField>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
            {labels.phoneNumber} <span className="text-[#9969F8]">*</span>
          </Label>
          <Input
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
            type="tel"
            autoComplete="tel"
            {...register('phoneNumber', { required: labels.phoneNumber })}
          />
          <FieldError className="text-xs text-red-500 mt-1">{errors.phoneNumber?.message}</FieldError>
        </TextField>

      </div>

      <div className="flex justify-end gap-3 mt-7">
        {onCancel && (
          <Button
            type="button"
            variant="danger-soft"
            className="rounded-xl px-5"
            onClick={onCancel}
          >
            {labels.cancel}
          </Button>
        )}
        <Button
          type="submit"
          isDisabled={isSubmitting}
          className="rounded-xl px-6 bg-[#9969F8] text-white hover:opacity-90 transition"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {labels.submit}
        </Button>
      </div>
    </Form>
  );
}
