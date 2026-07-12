'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, MapPin, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '../checkout-provider';
import { setShippingAddress, createCustomerAddress } from '../actions';
import { I18N } from '@/i18n/keys';
import { CustomerAddress } from '../../account/addresses/addresses-client';
import { AddressForm, AddressFormData } from '../../account/addresses/address-form';
import { useTranslations } from 'next-intl';
import { trackAddShippingInfo } from '@/lib/analytics/events';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

interface ShippingAddressStepProps {
  onComplete: () => void;
  t: (key: string) => string;
}

function hasGoogleCoordinates(address?: CustomerAddress | null) {
  const latitude = Number(address?.customFields?.latitude);
  const longitude = Number(address?.customFields?.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude);
}

export default function ShippingAddressStep({ onComplete, t }: ShippingAddressStepProps) {
  const td = useTranslations('Account.addresses');
  const router = useRouter();
  const { addresses, countries, order, googleMapsApiKey } = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    if (order.shippingAddress) {
      const match = addresses.find(
        (a) =>
          a.streetLine1 === order.shippingAddress?.streetLine1 &&
          a.postalCode === order.shippingAddress?.postalCode,
      );
      if (match) return match.id;
    }
    return addresses.find((a) => a.defaultShippingAddress)?.id ?? null;
  });

  const [dialogOpen, setDialogOpen] = useState(addresses.length === 0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [useSameForBilling, setUseSameForBilling] = useState(true);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const selectedAddressHasCoords = hasGoogleCoordinates(selectedAddress);

  const { reset } = useForm<AddressFormData>({
    defaultValues: { countryCode: countries[0]?.id ?? 'CO' },
  });

  const handleSelectExistingAddress = async () => {
    if (!selectedAddressId) return;
    setLoading(true);
    try {
      const addr = addresses.find((a) => a.id === selectedAddressId);
      if (!addr) return;
      await setShippingAddress(
        {
          fullName: addr.fullName || '',
          company: addr.company || '',
          streetLine1: addr.streetLine1,
          streetLine2: addr.streetLine2 || '',
          city: addr.city || '',
          province: addr.province || '',
          postalCode: addr.postalCode || '',
          countryCode: addr.country.code,
          phoneNumber: addr.phoneNumber || '',
          customFields: addr.customFields || undefined,
        },
        useSameForBilling,
      );
      trackAddShippingInfo({ shipping_tier: 'standard' });
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
      const country = countries.find(
        (c) => c.id === data.countryCode || c.code === data.countryCode,
      );
      if (!country) throw new Error('Invalid country');
      const newAddress = await createCustomerAddress({ ...data, countryCode: country.code });
      setDialogOpen(false);
      reset();
      router.refresh();
      setSelectedAddressId(newAddress.id);
    } catch (error) {
      console.error('Error creating address:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 pt-2">

      {/* Address cards */}
      {addresses.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{t(I18N.Checkout.shippingAddress.selectSaved)}</p>

          <div className="space-y-2">
            {addresses.map((address) => {
              const hasCoords = hasGoogleCoordinates(address);
              const isSelected = selectedAddressId === address.id;

              return (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => setSelectedAddressId(address.id)}
                  className={clsx(
                    'w-full text-left rounded-xl border-2 p-4 transition-all duration-150 cursor-pointer',
                    isSelected
                      ? 'border-[#9969F8] bg-[#9969F8]/5 shadow-sm'
                      : 'border-border bg-card hover:border-[#9969F8]/40 hover:bg-muted/30',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={clsx(
                        'mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                        isSelected ? 'border-[#9969F8] bg-[#9969F8]' : 'border-muted-foreground/40',
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <p className="font-semibold text-sm text-foreground">{address.fullName}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {address.streetLine1}
                          {address.streetLine2 && `, ${address.streetLine2}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.province} {address.postalCode}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.phoneNumber}</p>
                      </div>
                    </div>

                    {/* Coords badge */}
                    <div className="flex-shrink-0">
                      {hasCoords ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Maps
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          Sin coords
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No coordinates warning */}
      {selectedAddressId && !selectedAddressHasCoords && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Esta dirección no tiene coordenadas de Google Maps. Agrega una nueva dirección seleccionándola desde el autocomplete.</span>
        </div>
      )}

      {/* Same billing checkbox */}
      <label className="flex items-center gap-3 py-1 cursor-pointer select-none">
        <div
          className={clsx(
            'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0',
            useSameForBilling ? 'bg-[#9969F8] border-[#9969F8]' : 'bg-background border-border',
          )}
        >
          {useSameForBilling && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <input
          id="same-billing"
          type="checkbox"
          className="sr-only"
          checked={useSameForBilling}
          onChange={(e) => setUseSameForBilling(e.target.checked)}
        />
        <span className={clsx('text-sm font-medium', useSameForBilling ? 'text-[#9969F8]' : 'text-foreground')}>
          {t(I18N.Checkout.shippingAddress.sameBilling)}
        </span>
      </label>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSelectExistingAddress}
          isDisabled={!selectedAddressId || loading || !selectedAddressHasCoords}
          className="flex-1 rounded-xl bg-[#9969F8] text-white hover:opacity-90 transition font-semibold h-11"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t(I18N.Checkout.shippingAddress.continueWithSelected)}
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-2 border-[#9969F8]/40 text-[#9969F8] hover:bg-[#9969F8]/10 transition font-medium h-11 gap-2"
            >
              <Plus className="w-4 h-4" />
              {t(I18N.Checkout.shippingAddress.addNew)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#9969F8]" />
                {td(I18N.Account.addresses.form.actions.addNewAddress)}
              </DialogTitle>
              <DialogDescription>
                {td(I18N.Account.addresses.form.actions.fillForm)}
              </DialogDescription>
            </DialogHeader>
            <AddressForm
              countries={countries}
              googleMapsApiKey={googleMapsApiKey}
              isSubmitting={saving}
              requireGoogleCoordinates
              onSubmit={onSaveNewAddress}
              onCancel={() => setDialogOpen(false)}
              labels={{
                fullName: td(I18N.Account.addresses.form.fields.fullName.label),
                company: td(I18N.Account.addresses.form.fields.company.label),
                streetLine1: td(I18N.Account.addresses.form.fields.streetLine1.label),
                streetLine2: td(I18N.Account.addresses.form.fields.streetLine2.label),
                city: td(I18N.Account.addresses.form.fields.city.label),
                province: td(I18N.Account.addresses.form.fields.province.label),
                postalCode: td(I18N.Account.addresses.form.fields.postalCode.label),
                country: td(I18N.Account.addresses.form.fields.countryCode.label),
                phoneNumber: td(I18N.Account.addresses.form.fields.phoneNumber.label),
                cancel: td(I18N.Account.addresses.form.actions.cancel),
                submit: td(I18N.Account.addresses.form.actions.save),
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
