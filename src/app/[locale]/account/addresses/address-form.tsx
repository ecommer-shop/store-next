'use client';

import { Button } from '@heroui/react';
import { Input } from '@heroui/react';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { useForm, Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { CountrySelect } from '@/components/shared/country-select';
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';

interface Country {
  id: string;
  code: string;
  name: string;
}

interface AddressFormData {
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

interface CustomerAddress {
  id: string;
  fullName?: string | null;
  company?: string | null;
  streetLine1: string;
  streetLine2?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country: { id: string; code: string; name: string };
  phoneNumber?: string | null;
  defaultShippingAddress?: boolean | null;
  defaultBillingAddress?: boolean | null;
}

interface AddressFormProps {
  countries: Country[];
  address?: CustomerAddress;
  onSubmit: (data: AddressFormData & { id?: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function AddressForm({ countries, address, onSubmit, onCancel, isSubmitting }: AddressFormProps) {
  const { register, handleSubmit, formState: { errors }, control } = useForm<AddressFormData>({
    defaultValues: address ? {
      fullName: address.fullName || '',
      company: address.company || '',
      streetLine1: address.streetLine1,
      streetLine2: address.streetLine2 || '',
      city: address.city || '',
      province: address.province || '',
      postalCode: address.postalCode || '',
      countryCode: address.country.code,
      phoneNumber: address.phoneNumber || '',
    } : {
      countryCode: countries[0]?.code || 'US',
    }
  });

  const handleFormSubmit = async (data: AddressFormData) => {
    await onSubmit(address ? { ...data, id: address.id } : data);
  };
  const t = useTranslations('AccountAddresses');  
  const b = useTranslations('ButtonLabels');
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FieldGroup className="my-6">
        <div className="grid grid-cols-2 gap-4">
          <Field className="col-span-2">
            <FieldLabel htmlFor="fullName">{I18N.Account.addresses.form.fields.fullName.label} *</FieldLabel>
            <Input
              id="fullName"
              {...register('fullName', { required: I18N.Account.addresses.form.fields.fullName.requiredError })}
              disabled={isSubmitting}
            />
            <FieldError>{errors.fullName?.message}</FieldError>
          </Field>

          <Field className="col-span-2">
            <FieldLabel htmlFor="company">{I18N.Account.addresses.form.fields.company.label}</FieldLabel>
            <Input id="company" {...register('company')} disabled={isSubmitting} />
          </Field>

          <Field className="col-span-2">
            <FieldLabel htmlFor="streetLine1">{I18N.Account.addresses.form.fields.streetLine1.label} *</FieldLabel>
            <Input
              id="streetLine1"
              {...register('streetLine1', { required: I18N.Account.addresses.form.fields.streetLine1.requiredError })}
              disabled={isSubmitting}
            />
            <FieldError>{errors.streetLine1?.message}</FieldError>
          </Field>

          <Field className="col-span-2">
            <FieldLabel htmlFor="streetLine2">{I18N.Account.addresses.form.fields.streetLine2.label}</FieldLabel>
            <Input id="streetLine2" {...register('streetLine2')} disabled={isSubmitting} />
          </Field>

          <Field>
            <FieldLabel htmlFor="city">{I18N.Account.addresses.form.fields.city.label} *</FieldLabel>
            <Input
              id="city"
              {...register('city', { required: I18N.Account.addresses.form.fields.city.requiredError })}
              disabled={isSubmitting}
            />
            <FieldError>{errors.city?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="province">{I18N.Account.addresses.form.fields.province.label} *</FieldLabel>
            <Input
              id="province"
              {...register('province', { required: I18N.Account.addresses.form.fields.province.requiredError })}
              disabled={isSubmitting}
            />
            <FieldError>{errors.province?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="postalCode">{I18N.Account.addresses.form.fields.postalCode.label} *</FieldLabel>
            <Input
              id="postalCode"
              {...register('postalCode', { required: I18N.Account.addresses.form.fields.postalCode.requiredError })}
              disabled={isSubmitting}
            />
            <FieldError>{errors.postalCode?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="countryCode">{I18N.Account.addresses.form.fields.countryCode.label} *</FieldLabel>
            <Controller
              name="countryCode"
              control={control}
              rules={{ required: I18N.Account.addresses.form.fields.countryCode.requiredError }}
              render={({ field }) => (
                <CountrySelect
                  countries={countries}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />
            <FieldError>{errors.countryCode?.message}</FieldError>
          </Field>

          <Field className="col-span-2">
            <FieldLabel htmlFor="phoneNumber">{I18N.Account.addresses.form.fields.phoneNumber.label} *</FieldLabel>
            <Input
              id="phoneNumber"
              type="tel"
              {...register('phoneNumber', { required: I18N.Account.addresses.form.fields.phoneNumber.requiredError })}
              disabled={isSubmitting}
            />
            <FieldError>{errors.phoneNumber?.message}</FieldError>
          </Field>
        </div>
      </FieldGroup>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={onCancel} isDisabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isDisabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {address ? 'Update address' : 'Save address'}
        </Button>
      </div>
    </form>
  );
}
