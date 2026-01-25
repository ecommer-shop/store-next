'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@heroui/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { useForm, Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '../checkout-provider';
import { setShippingAddress, createCustomerAddress } from '../actions';
import { CountrySelect } from '@/components/shared/country-select';
import { I18N } from '@/i18n/keys';

interface ShippingAddressStepProps {
  onComplete: () => void;
  t: (key: string) => string;
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

export default function ShippingAddressStep({ onComplete, t }: ShippingAddressStepProps) {
  const router = useRouter();
  const { addresses, countries, order } = useCheckout();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    // If order already has a shipping address, try to match it with saved addresses
    if (order.shippingAddress) {
      const matchingAddress = addresses.find(
        (a) =>
          a.streetLine1 === order.shippingAddress?.streetLine1 &&
          a.postalCode === order.shippingAddress?.postalCode
      );
      if (matchingAddress) return matchingAddress.id;
    }
    // Otherwise use default shipping address
    const defaultAddress = addresses.find((a) => a.defaultShippingAddress);
    return defaultAddress?.id || null;
  });
  const [dialogOpen, setDialogOpen] = useState(addresses.length === 0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [useSameForBilling, setUseSameForBilling] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<AddressFormData>({
    defaultValues: {
      countryCode: countries[0]?.code || 'US',
    }
  });

  const handleSelectExistingAddress = async () => {
    if (!selectedAddressId) return;

    setLoading(true);
    try {
      const selectedAddress = addresses.find(a => a.id === selectedAddressId);
      if (!selectedAddress) return;

      await setShippingAddress({
        fullName: selectedAddress.fullName || '',
        company: selectedAddress.company || '',
        streetLine1: selectedAddress.streetLine1,
        streetLine2: selectedAddress.streetLine2 || '',
        city: selectedAddress.city || '',
        province: selectedAddress.province || '',
        postalCode: selectedAddress.postalCode || '',
        countryCode: selectedAddress.country.code,
        phoneNumber: selectedAddress.phoneNumber || '',
      }, useSameForBilling);

      router.refresh();
      onComplete();
    } catch (error) {
      console.error('Error setting address:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSaveNewAddress = async (data: AddressFormData) => {
    setSaving(true);
    try {
      // First create the address in Vendure
      const newAddress = await createCustomerAddress(data);

      // Close dialog and reset form
      setDialogOpen(false);
      reset();

      // Refresh to get updated addresses list
      router.refresh();

      // Select the newly created address
      setSelectedAddressId(newAddress.id);
    } catch (error) {
      console.error('Error creating address:', error);
      alert(`Error creating address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {addresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">{t(I18N.Checkout.shippingAddress.selectSaved)}</h3>
          <RadioGroup value={selectedAddressId || ''} onValueChange={setSelectedAddressId}>
            {addresses.map((address) => (
              <div key={address.id} className="flex items-start space-x-3">
                <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                  <Card className="p-4">
                    <div className="leading-tight space-y-0">
                      <p className="font-medium">{address.fullName}</p>
                      {address.company && <p className="text-sm text-muted-foreground">{address.company}</p>}
                      <p className="text-sm text-muted-foreground">
                        {address.streetLine1}
                        {address.streetLine2 && `, ${address.streetLine2}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.province} {address.postalCode}
                      </p>
                      <p className="text-sm text-muted-foreground">{address.country.name}</p>
                      <p className="text-sm text-muted-foreground">{address.phoneNumber}</p>
                    </div>
                  </Card>
                </Label>
              </div>
            ))}
          </RadioGroup>
          {}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="same-billing"
              /*checked={useSameForBilling}*/ 
              onChange={(checked) => setUseSameForBilling(checked === true)}
            />
            <label
              htmlFor="same-billing"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t(I18N.Checkout.shippingAddress.sameBilling)}
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSelectExistingAddress}
              isDisabled={!selectedAddressId || loading}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t(I18N.Checkout.shippingAddress.continueWithSelected)}
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="ghost">
                  {t(I18N.Checkout.shippingAddress.addNew)}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit(onSaveNewAddress)}>
                  <DialogHeader>
                    <DialogTitle>{t(I18N.Checkout.shippingAddress.addNew)}</DialogTitle>
                    <DialogDescription>
                      {t(I18N.Checkout.shippingAddress.fillForm)}
                    </DialogDescription>
                  </DialogHeader>

                  <FieldGroup className="my-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Field className="col-span-2">
                        <FieldLabel htmlFor="fullName">{t(I18N.Checkout.shippingAddress.labels.fullName)}</FieldLabel>
                        <Input
                          id="fullName"
                          {...register('fullName')}
                        />
                        <FieldError>{errors.fullName?.message}</FieldError>
                      </Field>

                      <Field className="col-span-2">
                        <FieldLabel htmlFor="company">{t(I18N.Checkout.shippingAddress.labels.company)}</FieldLabel>
                        <Input id="company" {...register('company')} />
                      </Field>

                      <Field className="col-span-2">
                        <FieldLabel htmlFor="streetLine1">{t(I18N.Checkout.shippingAddress.labels.streetAddress)}</FieldLabel>
                        <Input
                          id="streetLine1"
                          {...register('streetLine1', { required: t(I18N.Checkout.shippingAddress.errors.streetRequired) })}
                        />
                        <FieldError>{errors.streetLine1?.message}</FieldError>
                      </Field>

                      <Field className="col-span-2">
                        <FieldLabel htmlFor="streetLine2">{t(I18N.Checkout.shippingAddress.labels.apartmentSuite)}</FieldLabel>
                        <Input id="streetLine2" {...register('streetLine2')} />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="city">{t(I18N.Checkout.shippingAddress.labels.city)}</FieldLabel>
                        <Input
                          id="city"
                          {...register('city')}
                        />
                        <FieldError>{errors.city?.message}</FieldError>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="province">{t(I18N.Checkout.shippingAddress.labels.state)}</FieldLabel>
                        <Input
                          id="province"
                          {...register('province')}
                        />
                        <FieldError>{errors.province?.message}</FieldError>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="postalCode">{t(I18N.Checkout.shippingAddress.labels.postalCode)}</FieldLabel>
                        <Input
                          id="postalCode"
                          {...register('postalCode')}
                        />
                        <FieldError>{errors.postalCode?.message}</FieldError>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="countryCode">{t(I18N.Checkout.shippingAddress.labels.country)}</FieldLabel>
                        <Controller
                          name="countryCode"
                          control={control}
                          rules={{ required: t(I18N.Checkout.shippingAddress.errors.countryRequired) }}
                          render={({ field }) => (
                            <CountrySelect
                              countries={countries}
                              
                              disabled={saving}
                            />
                          )}
                        />
                        <FieldError>{errors.countryCode?.message}</FieldError>
                      </Field>

                      <Field className="col-span-2">
                        <FieldLabel htmlFor="phoneNumber">{t(I18N.Checkout.shippingAddress.labels.phoneNumber)}</FieldLabel>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          {...register('phoneNumber')}
                        />
                        <FieldError>{errors.phoneNumber?.message}</FieldError>
                      </Field>
                    </div>
                  </FieldGroup>

                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} isDisabled={saving}>
                      {t(I18N.Checkout.shippingAddress.actions.cancel)}
                    </Button>
                    <Button type="submit" isDisabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t(I18N.Checkout.shippingAddress.actions.save)}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {addresses.length === 0 && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onSaveNewAddress)}>
              <DialogHeader>
                <DialogTitle>{t(I18N.Checkout.shippingAddress.addShippingAddress)}</DialogTitle>
                <DialogDescription>
                  {t(I18N.Checkout.shippingAddress.fillForm)}
                </DialogDescription>
              </DialogHeader>

              <FieldGroup className="my-6">
                <div className="grid grid-cols-2 gap-4">
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="fullName">{t(I18N.Checkout.shippingAddress.labels.fullName)}</FieldLabel>
                    <Input
                      id="fullName"
                      {...register('fullName')}
                    />
                    <FieldError>{errors.fullName?.message}</FieldError>
                  </Field>

                  <Field className="col-span-2">
                    <FieldLabel htmlFor="company">{t(I18N.Checkout.shippingAddress.labels.company)}</FieldLabel>
                    <Input id="company" {...register('company')} />
                  </Field>

                  <Field className="col-span-2">
                    <FieldLabel htmlFor="streetLine1">{t(I18N.Checkout.shippingAddress.labels.streetAddress)}</FieldLabel>
                    <Input
                      id="streetLine1"
                      {...register('streetLine1', { required: t(I18N.Checkout.shippingAddress.errors.streetRequired) })}
                    />
                    <FieldError>{errors.streetLine1?.message}</FieldError>
                  </Field>

                  <Field className="col-span-2">
                    <FieldLabel htmlFor="streetLine2">{t(I18N.Checkout.shippingAddress.labels.apartmentSuite)}</FieldLabel>
                    <Input id="streetLine2" {...register('streetLine2')} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="city">{t(I18N.Checkout.shippingAddress.labels.city)}</FieldLabel>
                    <Input
                      id="city"
                      {...register('city')}
                    />
                    <FieldError>{errors.city?.message}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="province">{t(I18N.Checkout.shippingAddress.labels.state)}</FieldLabel>
                    <Input
                      id="province"
                      {...register('province')}
                    />
                    <FieldError>{errors.province?.message}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="postalCode">{t(I18N.Checkout.shippingAddress.labels.postalCode)}</FieldLabel>
                    <Input
                      id="postalCode"
                      {...register('postalCode')}
                    />
                    <FieldError>{errors.postalCode?.message}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="countryCode">{t(I18N.Checkout.shippingAddress.labels.country)}</FieldLabel>
                    <Controller
                      name="countryCode"
                      control={control}
                      rules={{ required: t(I18N.Checkout.shippingAddress.errors.countryRequired) }}
                      render={({ field }) => (
                        <CountrySelect
                          countries={countries}
                          
                          disabled={saving}
                        />
                      )}
                    />
                    <FieldError>{errors.countryCode?.message}</FieldError>
                  </Field>

                  <Field className="col-span-2">
                    <FieldLabel htmlFor="phoneNumber">{t(I18N.Checkout.shippingAddress.labels.phoneNumber)}</FieldLabel>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      {...register('phoneNumber')}
                    />
                    <FieldError>{errors.phoneNumber?.message}</FieldError>
                  </Field>
                </div>
              </FieldGroup>

              <DialogFooter>
                <Button type="submit" isDisabled={saving} className="w-full">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t(I18N.Checkout.shippingAddress.actions.save)}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
