'use client';

import { Button, FieldError, Form, Label, TextField } from '@heroui/react';
import { Input } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { Loader2, MapPin } from 'lucide-react';
import { CountrySelect } from '@/components/shared/country-select';
import { getMatiasCity, MATIAS_COLOMBIA_CITIES } from '@/lib/matias-cities';
import { MATIAS_IDENTITY_DOCUMENT_TYPES } from '@/lib/matias-document-types';
import {
  GoogleAddressAutocomplete,
  GoogleAddressSelection,
  GoogleLocationMapPreview,
} from '@/components/shared/google-address-autocomplete';
import { GoogleMapPicker, MapPickerSelection } from '@/components/shared/google-map-picker';
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
  matiasCityId?: string | null;
  dni?: string | null;
  identityDocumentId?: string | null;
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
  matiasCityId?: string;
  dni?: string;
  identityDocumentId?: string;
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

function matchMatiasCity(cityName?: string | null, provinceName?: string | null) {
  if (!cityName) return undefined;
  const cityLower = cityName.trim().toLocaleLowerCase('es');
  const provinceLower = provinceName?.trim().toLocaleLowerCase('es');
  return (
    MATIAS_COLOMBIA_CITIES.find(
      (city) =>
        city.city.toLocaleLowerCase('es') === cityLower &&
        (!provinceLower || city.department.toLocaleLowerCase('es') === provinceLower),
    ) ??
    MATIAS_COLOMBIA_CITIES.find((city) => city.city.toLocaleLowerCase('es') === cityLower)
  );
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
  const { register, handleSubmit, control, formState: { errors }, setValue, getValues, watch, trigger } =
    useForm<AddressFormData>({
      mode: 'onBlur',
      defaultValues: {
        countryCode: countries[0]?.id ?? countries[0]?.code ?? 'CO',
        identityDocumentId: '1',
        ...defaultValues,
      },
    });
  const geoFields = watch('customFields');
  const selectedStreetLine = watch('streetLine1');
  const selectedDepartment = watch('province');
  const selectedMatiasCity = getMatiasCity(watch('matiasCityId'));
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const hasGoogleMapsApiKey = Boolean(googleMapsApiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  const matiasDepartments = Array.from(
    new Set(MATIAS_COLOMBIA_CITIES.map((city) => city.department)),
  ).sort((a, b) => a.localeCompare(b, 'es'));
  const matiasCitiesForDepartment = selectedDepartment
    ? MATIAS_COLOMBIA_CITIES.filter((city) => city.department === selectedDepartment)
    : MATIAS_COLOMBIA_CITIES;

  const applyMatiasMatch = useCallback(
    (cityName?: string | null, provinceName?: string | null, postalCode?: string | null) => {
      const matched = matchMatiasCity(cityName, provinceName);
      if (!matched) return;
      setValue('matiasCityId', matched.id, { shouldDirty: true, shouldValidate: true });
      setValue('city', matched.city, { shouldDirty: true, shouldValidate: true });
      setValue('province', matched.department, { shouldDirty: true, shouldValidate: true });
      if (matched.postalCode || postalCode) {
        setValue('postalCode', matched.postalCode || postalCode || '', {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    },
    [setValue],
  );

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

    applyMatiasMatch(selection.city, selection.province, selection.postalCode);

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
  }, [applyMatiasMatch, countries, getValues, setValue]);

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

  const handleMapPickerSelect = useCallback((selection: MapPickerSelection) => {
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

    applyMatiasMatch(selection.city, selection.province, selection.postalCode);

    setValue(
      'customFields',
      {
        ...getValues('customFields'),
        latitude: selection.latitude,
        longitude: selection.longitude,
        neighborhood: selection.neighborhood || null,
        googlePlaceId: null,
      },
      { shouldDirty: true, shouldValidate: true },
    );

    setGeoError(null);
    setIsMapPickerOpen(false);
  }, [applyMatiasMatch, countries, getValues, setValue]);

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
      customFields: {
        ...data.customFields,
        ...(hasCoordinates
          ? {
              latitude,
              longitude,
            }
          : {}),
        ...(data.matiasCityId ? { matiasCityId: data.matiasCityId } : {}),
        ...(data.dni ? { dni: data.dni } : {}),
        ...(data.identityDocumentId ? { identityDocumentId: data.identityDocumentId } : {}),
      },
    });
  });

  return (
    <Form onSubmit={submitForm}>
      <input type="hidden" {...register('city', { required: labels.city })} />
      <input type="hidden" {...register('customFields.latitude')} />
      <input type="hidden" {...register('customFields.longitude')} />
      <input type="hidden" {...register('customFields.neighborhood')} />
      <input type="hidden" {...register('customFields.googlePlaceId')} />
      <input type="hidden" {...register('company')} />

      <div className="space-y-5">

        <Controller
          name="fullName"
          control={control}
          rules={{ required: labels.fullName }}
          render={({ field }) => (
            <TextField>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
                {labels.fullName} <span className="text-[#9969F8]">*</span>
              </Label>
              <Input
                {...field}
                value={field.value || ''}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
                autoComplete="name"
              />
              <FieldError className="text-xs text-red-500 mt-1">{errors.fullName?.message}</FieldError>
            </TextField>
          )}
        />

        {hasGoogleMapsApiKey ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {labels.streetLine1} <span className="text-[#9969F8]">*</span>
              </Label>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-[#9969F8] hover:bg-[#9969F8]/10 rounded-lg text-xs h-auto py-1 cursor-pointer"
                onPress={() => setIsMapPickerOpen(true)}
              >
                <MapPin className="h-3 w-3 mr-1" />
                Seleccionar ubicación en el mapa
              </Button>
            </div>

            {hasValidCoordinates ? (
              <TextField>
                <Input
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
                  autoComplete="address-line1"
                  value={selectedStreetLine || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setValue('streetLine1', newValue, { shouldDirty: true, shouldValidate: true });
                    setValue('customFields', {
                      ...getValues('customFields'),
                      latitude: null,
                      longitude: null,
                      neighborhood: null,
                      googlePlaceId: null,
                    }, { shouldDirty: true });
                  }}
                />
                <FieldError className="text-xs text-red-500 mt-1">{errors.streetLine1?.message}</FieldError>
              </TextField>
            ) : (
              <Controller
                name="streetLine1"
                control={control}
                rules={{ required: labels.streetLine1 }}
                render={({ field }) => (
                  <GoogleAddressAutocomplete
                    label=""
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
            )}
            {!hasValidCoordinates && (
              <FieldError className="text-xs text-red-500 mt-1">{errors.streetLine1?.message}</FieldError>
            )}
          </div>
        ) : (
          <Controller
            name="streetLine1"
            control={control}
            rules={{ required: labels.streetLine1 }}
            render={({ field }) => (
              <TextField>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
                  {labels.streetLine1} <span className="text-[#9969F8]">*</span>
                </Label>
                <Input
                  {...field}
                  value={field.value || ''}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
                  autoComplete="address-line1"
                />
                <FieldError className="text-xs text-red-500 mt-1">{errors.streetLine1?.message}</FieldError>
              </TextField>
            )}
          />
        )}

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

        {geoError && (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {geoError}
          </div>
        )}

        <Controller
          name="streetLine2"
          control={control}
          render={({ field }) => (
            <TextField>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
                {labels.streetLine2}
              </Label>
              <Input
                {...field}
                value={field.value || ''}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
                placeholder="Apto, piso, oficina…"
              />
            </TextField>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
              {labels.province} <span className="text-[#9969F8]">*</span>
            </Label>
            <Controller
              name="province"
              control={control}
              rules={{ required: labels.province }}
              render={({ field }) => (
                <select
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
                  value={field.value ?? ''}
                  onChange={(event) => {
                    const department = event.target.value;
                    field.onChange(department);
                    if (selectedMatiasCity && selectedMatiasCity.department !== department) {
                      setValue('matiasCityId', '', { shouldValidate: true });
                      setValue('city', '', { shouldValidate: true });
                    }
                  }}
                >
                  <option value="">Selecciona departamento</option>
                  {matiasDepartments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              )}
            />
            <FieldError className="text-xs text-red-500 mt-1">{errors.province?.message}</FieldError>
          </TextField>

          <TextField>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
              {labels.city} <span className="text-[#9969F8]">*</span>
            </Label>
            <Controller
              name="matiasCityId"
              control={control}
              rules={{ required: labels.city }}
              render={({ field }) => (
                <select
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
                  value={field.value ?? ''}
                  onChange={(event) => {
                    const city = getMatiasCity(event.target.value);
                    field.onChange(event.target.value);
                    if (city) {
                      setValue('city', city.city, { shouldValidate: true });
                      setValue('province', city.department, { shouldValidate: true });
                      if (city.postalCode) {
                        setValue('postalCode', city.postalCode, { shouldValidate: true });
                      }
                    }
                  }}
                >
                  <option value="">Selecciona ciudad</option>
                  {matiasCitiesForDepartment.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.city}
                    </option>
                  ))}
                </select>
              )}
            />
            <FieldError className="text-xs text-red-500 mt-1">{errors.matiasCityId?.message}</FieldError>
          </TextField>
        </div>

        <div className="grid gap-4 rounded-xl border border-border p-4">
          <p className="text-sm font-semibold text-foreground">Datos para facturación electrónica</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
                Tipo de documento <span className="text-[#9969F8]">*</span>
              </Label>
              <Controller
                name="identityDocumentId"
                control={control}
                rules={{ required: 'Tipo de documento' }}
                render={({ field }) => (
                  <select
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
                    value={field.value ?? '1'}
                    onChange={field.onChange}
                  >
                    {MATIAS_IDENTITY_DOCUMENT_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label} ({type.code})
                      </option>
                    ))}
                  </select>
                )}
              />
              <FieldError className="text-xs text-red-500 mt-1">{errors.identityDocumentId?.message}</FieldError>
            </TextField>

            <TextField>
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
                Documento / NIT <span className="text-[#9969F8]">*</span>
              </Label>
              <Input
                {...register('dni', { required: 'Documento / NIT' })}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
              />
              <FieldError className="text-xs text-red-500 mt-1">{errors.dni?.message}</FieldError>
            </TextField>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="postalCode"
            control={control}
            rules={{ required: labels.postalCode }}
            render={({ field }) => (
              <TextField>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
                  {labels.postalCode} <span className="text-[#9969F8]">*</span>
                </Label>
                <Input
                  {...field}
                  value={field.value || ''}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
                />
                <FieldError className="text-xs text-red-500 mt-1">{errors.postalCode?.message}</FieldError>
              </TextField>
            )}
          />

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

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">
            {labels.phoneNumber} <span className="text-[#9969F8]">*</span>
          </Label>
          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              required: 'El número de teléfono es requerido',
              validate: (value) => {
                if (!value || value.length === 0) {
                  return 'El número de teléfono es requerido';
                }
                if (!/^\d+$/.test(value)) {
                  return 'El número de teléfono solo puede contener números';
                }
                if (value.length !== 10) {
                  return 'Por favor diligenciar 10 digitos';
                }
                return true;
              }
            }}
            render={({ field }) => (
              <input
                {...field}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]/40 transition"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={10}
                placeholder="3001234567"
                value={field.value || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  field.onChange(value);
                }}
                onBlur={() => {
                  field.onBlur();
                  trigger('phoneNumber');
                }}
              />
            )}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

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

      {isMapPickerOpen && (
        <GoogleMapPicker
          apiKey={googleMapsApiKey}
          initialLatitude={normalizeCoordinate(geoFields?.latitude) ?? undefined}
          initialLongitude={normalizeCoordinate(geoFields?.longitude) ?? undefined}
          onLocationSelect={handleMapPickerSelect}
          onClose={() => setIsMapPickerOpen(false)}
        />
      )}
    </Form>
  );
}
