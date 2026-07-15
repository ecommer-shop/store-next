'use client';

import { Button, FieldError, Form, Label, TextField } from '@heroui/react';
import { Input } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { CountrySelect } from '@/components/shared/country-select';
import { getMatiasCity, MATIAS_COLOMBIA_CITIES } from '@/lib/matias-cities';
import { MATIAS_IDENTITY_DOCUMENT_TYPES } from '@/lib/matias-document-types';

export interface Country {
  id: string;
  code: string;
  name: string;
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
}

interface AddressFormProps {
  countries: Country[];
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
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

export function AddressForm({
  countries,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  labels,
}: AddressFormProps) {
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } =
    useForm<AddressFormData>({
      defaultValues: {
        countryCode: countries[0]?.code ?? 'CO',
        identityDocumentId: '1',
        ...defaultValues,
      },
    });
  const selectedDepartment = watch('province');
  const selectedMatiasCity = getMatiasCity(watch('matiasCityId'));
  const matiasDepartments = Array.from(
    new Set(MATIAS_COLOMBIA_CITIES.map((city) => city.department)),
  ).sort((a, b) => a.localeCompare(b, 'es'));
  const matiasCitiesForDepartment = selectedDepartment
    ? MATIAS_COLOMBIA_CITIES.filter((city) => city.department === selectedDepartment)
    : MATIAS_COLOMBIA_CITIES;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <input type="hidden" {...register('city', { required: labels.city })} />
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
          <Input {...register('streetLine1', { required: labels.streetLine1 })} />
          <FieldError>{errors.streetLine1?.message}</FieldError>
        </TextField>

        <TextField className="col-span-2">
          <Label>{labels.streetLine2}</Label>
          <Input {...register('streetLine2')} />
        </TextField>

        <TextField>
          <Label>{labels.province} *</Label>
          <Controller
            name="province"
            control={control}
            rules={{ required: labels.province }}
            render={({ field }) => (
              <select
                className="w-full rounded-xl border border-border bg-primary-foreground px-3 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
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
          <FieldError>{errors.province?.message}</FieldError>
        </TextField>

        <TextField>
          <Label>{labels.city} *</Label>
          <Controller
            name="matiasCityId"
            control={control}
            rules={{ required: labels.city }}
            render={({ field }) => (
              <select
                className="w-full rounded-xl border border-border bg-primary-foreground px-3 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
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
          <FieldError>{errors.matiasCityId?.message}</FieldError>
        </TextField>

        <div className="col-span-2 grid gap-4 rounded-xl border border-border p-4">
          <p className="text-sm font-semibold text-foreground">Datos para facturación electrónica</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField>
              <Label>Tipo de documento *</Label>
              <Controller
                name="identityDocumentId"
                control={control}
                rules={{ required: 'Tipo de documento' }}
                render={({ field }) => (
                  <select
                    className="w-full rounded-xl border border-border bg-primary-foreground px-3 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
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
              <FieldError>{errors.identityDocumentId?.message}</FieldError>
            </TextField>

            <TextField>
              <Label>Documento / NIT *</Label>
              <Input {...register('dni', { required: 'Documento / NIT' })} />
              <FieldError>{errors.dni?.message}</FieldError>
            </TextField>
          </div>
        </div>

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
