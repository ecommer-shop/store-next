'use client';

import { Button, FieldError, Form, Label, TextField } from '@heroui/react';
import { Input } from '@heroui/react';
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

export interface AddressFormData {
  fullName: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  countryId: string;
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
      countryId: address.country.code,
      phoneNumber: address.phoneNumber || '',
    } : {
      countryId: countries[0]?.code || 'US',
    }
  });

  const handleFormSubmit = async (data: AddressFormData) => {
    await onSubmit(address ? { ...data, id: address.id } : data);
    console.log("DATADELSUBMIT:", data)
  };
  const t = useTranslations('Account.addresses');
  const b = useTranslations('ButtonLabels');

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>

      <div className="grid grid-cols-2 gap-4 className='h-fit'">
        <TextField className="col-span-2">
          <Label htmlFor="fullName">{t(I18N.Account.addresses.form.fields.fullName.label)} *</Label>
          <Input
            id="fullName"
            {...register('fullName', { required: t(I18N.Account.addresses.form.fields.fullName.requiredError) })}
            disabled={isSubmitting}
          />
          <FieldError>{errors.fullName?.message}</FieldError>
        </TextField>

        <TextField className="col-span-2">
          <Label htmlFor="company">{t(I18N.Account.addresses.form.fields.company.label)}</Label>
          <Input id="company" {...register('company')} disabled={isSubmitting} />
        </TextField>

        <TextField className="col-span-2">
          <Label htmlFor="streetLine1">{t(I18N.Account.addresses.form.fields.streetLine1.label)} *</Label>
          <Input
            id="streetLine1"
            {...register('streetLine1', { required: t(I18N.Account.addresses.form.fields.streetLine1.requiredError) })}
            disabled={isSubmitting}
          />
          <FieldError>{errors.streetLine1?.message}</FieldError>
        </TextField>

        <TextField className="col-span-2">
          <Label htmlFor="streetLine2">{t(I18N.Account.addresses.form.fields.streetLine2.label)}</Label>
          <Input id="streetLine2" {...register('streetLine2')} disabled={isSubmitting} />
        </TextField>

        <TextField>
          <Label htmlFor="city">{t(I18N.Account.addresses.form.fields.city.label)} *</Label>
          <Input
            id="city"
            {...register('city', { required: t(I18N.Account.addresses.form.fields.city.requiredError) })}
            disabled={isSubmitting}
          />
          <FieldError>{errors.city?.message}</FieldError>
        </TextField>

        <TextField>
          <Label htmlFor="province">{t(I18N.Account.addresses.form.fields.province.label)} *</Label>
          <Input
            id="province"
            {...register('province', { required: t(I18N.Account.addresses.form.fields.province.requiredError) })}
            disabled={isSubmitting}
          />
          <FieldError>{errors.province?.message}</FieldError>
        </TextField>

        <TextField>
          <Label htmlFor="postalCode">{t(I18N.Account.addresses.form.fields.postalCode.label)} *</Label>
          <Input
            id="postalCode"
            {...register('postalCode', { required: t(I18N.Account.addresses.form.fields.postalCode.requiredError) })}
            disabled={isSubmitting}
          />
          <FieldError>{errors.postalCode?.message}</FieldError>
        </TextField>

        <TextField className="text-foreground">
          <Label htmlFor="countryId">
            {t(I18N.Account.addresses.form.fields.countryCode.label)} *
          </Label>

          <Controller
            name="countryId"
            control={control}
            rules={{ required: 'Country is required' }}
            render={({ field }) => (
              <CountrySelect
                countries={countries}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isSubmitting}
                name={field.name}
              />
            )}
          />

          <FieldError>{errors.countryId?.message}</FieldError>
        </TextField>


        <TextField className="col-span-2">
          <Label htmlFor="phoneNumber">{t(I18N.Account.addresses.form.fields.phoneNumber.label)} *</Label>
          <Input
            id="phoneNumber"
            type="tel"
            {...register('phoneNumber', { required: t(I18N.Account.addresses.form.fields.phoneNumber.requiredError) })}
            disabled={isSubmitting}
          />
          <FieldError>{errors.phoneNumber?.message}</FieldError>
        </TextField>
      </div>


      <div className="flex gap-3 justify-end mt-[20px]">
        <Button slot="close" type="button" variant="danger-soft"
        className="hover:bg-red-600 hover:text-primary-foreground
                 dark:hover:bg-red-600 dark:hover:text-primary
                 rounded-md"
        onClick={onCancel} isDisabled={isSubmitting}>
          {t(I18N.Account.addresses.form.actions.cancel)}
        </Button>
        <Button type="submit" 
        className="rounded-md
                hover:bg-primary hover:text-primary-foreground"
        isDisabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {address ? t(I18N.Account.addresses.form.actions.update) : t(I18N.Account.addresses.form.actions.save)}
        </Button>
      </div>
    </Form>
  );
}
