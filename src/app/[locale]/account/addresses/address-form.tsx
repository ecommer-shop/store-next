'use client';

import { Button, FieldError, Form, Label, TextField } from '@heroui/react';
import { Input } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { CountrySelect } from '@/components/shared/country-select';
import {
  GoogleAddressAutocomplete,
  GoogleAddressSelection,
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
      <div className="grid grid-cols-2 gap-4">
        <GoogleAddressAutocomplete onSelect={handleGoogleAddressSelect} />
        <input type="hidden" {...register('customFields.latitude')} />
        <input type="hidden" {...register('customFields.longitude')} />
        <input type="hidden" {...register('customFields.neighborhood')} />
        <input type="hidden" {...register('customFields.googlePlaceId')} />
        {hasValidCoordinates && latitude !== null && longitude !== null && (
          <div className="col-span-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            <p className="font-medium">Direccion seleccionada desde Google Maps</p>
            {selectedStreetLine && (
              <p className="mt-1 text-muted-foreground">{selectedStreetLine}</p>
            )}
            <p className="mt-1 text-xs text-emerald-700">
              {geoFields?.neighborhood && <span>Barrio: {geoFields.neighborhood}. </span>}
              Coordenadas guardadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
        )}
        {geoError && (
          <div className="col-span-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {geoError}
          </div>
        )}

        <TextField className="col-span-2">
          <Label>{labels.fullName} *</Label>
          <Input {...register('fullName', { required: labels.fullName })} />
          <FieldError>{errors.fullName?.message}</FieldError>
        </TextField>

        <TextField className="col-span-2">
          <Label>{labels.company}</Label>
          <Input {...register('company')} />
        </TextField>

        <TextField className="col-span-2">
          <Label>{labels.streetLine1} *</Label>
          <Input
            autoComplete="address-line1"
            placeholder="Se completa al seleccionar una direccion en Google Maps"
            {...register('streetLine1', { required: labels.streetLine1 })}
          />
          <FieldError>{errors.streetLine1?.message}</FieldError>
        </TextField>

        <TextField className="col-span-2">
          <Label>{labels.streetLine2}</Label>
          <Input {...register('streetLine2')} />
        </TextField>

        <TextField>
          <Label>{labels.city} *</Label>
          <Input {...register('city', { required: labels.city })} />
        </TextField>

        <TextField>
          <Label>{labels.province} *</Label>
          <Input {...register('province', { required: labels.province })} />
        </TextField>

        <TextField>
          <Label>{labels.postalCode} *</Label>
          <Input {...register('postalCode', { required: labels.postalCode })} />
        </TextField>

        <TextField>
          <Label>{labels.country} *</Label>
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
          <FieldError>{errors.countryCode?.message}</FieldError>
        </TextField>

        <TextField className="col-span-2">
          <Label>{labels.phoneNumber} *</Label>
          <Input {...register('phoneNumber', { required: labels.phoneNumber })} />
        </TextField>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        {onCancel && (
          <Button type="button" variant="danger-soft" onClick={onCancel}>
            {labels.cancel}
          </Button>
        )}
        <Button type="submit" isDisabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {labels.submit}
        </Button>
      </div>
    </Form>
  );
}
