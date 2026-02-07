'use client';

import { Button, FieldError, Form, Label, TextField } from '@heroui/react';
import { Input } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { CountrySelect } from '@/components/shared/country-select';

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
  const { register, handleSubmit, control, formState: { errors } } =
    useForm<AddressFormData>({
      defaultValues: {
        countryCode: countries[0]?.code ?? 'CO',
        ...defaultValues,
      },
    });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
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
