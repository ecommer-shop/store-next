'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, MapPin, Plus, CheckCircle2, AlertCircle, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useCheckout } from '../checkout-provider';
import { setShippingAddress, createCustomerAddress, updateCustomerAddress } from '../actions';
import { I18N } from '@/i18n/keys';
import { AddressForm, AddressFormData } from '../../account/addresses/address-form';
import { useTranslations } from 'next-intl';
import { trackAddShippingInfo } from '@/lib/analytics/events';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { getMatiasCity, MATIAS_COLOMBIA_CITIES } from '@/lib/matias-cities';

interface ShippingAddressStepProps {
  onComplete: () => void;
  t: (key: string) => string;
}

function hasGoogleCoordinates(address?: {
  customFields?: {
    latitude?: number | string | null;
    longitude?: number | string | null;
  } | null;
} | null) {
  const latitude = Number(address?.customFields?.latitude);
  const longitude = Number(address?.customFields?.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude) && !(latitude === 0 && longitude === 0);
}

export default function ShippingAddressStep({ onComplete, t }: ShippingAddressStepProps) {
  const td = useTranslations('Account.addresses');
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { redirectToSignIn } = useClerk();
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
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [useSameForBilling, setUseSameForBilling] = useState(true);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const selectedAddressHasCoords = hasGoogleCoordinates(selectedAddress);

  const { reset } = useForm<AddressFormData>({
    defaultValues: { countryCode: countries[0]?.id ?? 'CO' },
  });

  const resolveMatiasCityForAddress = (address: (typeof addresses)[number]) => {
    const savedCity = getMatiasCity(address.customFields?.matiasCityId);
    if (savedCity) return savedCity;
    const addressCity = address.city?.trim().toLocaleLowerCase('es') ?? '';
    const addressDepartment = address.province?.trim().toLocaleLowerCase('es') ?? '';
    return MATIAS_COLOMBIA_CITIES.find(
      (city) =>
        city.city.toLocaleLowerCase('es') === addressCity &&
        city.department.toLocaleLowerCase('es') === addressDepartment,
    );
  };

  const redirectToClerkSignIn = () => {
    void redirectToSignIn({
      redirectUrl: window.location.href,
    });
  };

  const ensureSignedIn = () => {
    if (!isLoaded) return false;
    if (!isSignedIn) {
      redirectToClerkSignIn();
      return false;
    }
    return true;
  };

  const handleSelectExistingAddress = async () => {
    if (!ensureSignedIn()) return;
    if (!selectedAddressId) return;

    const selected = addresses.find((a) => a.id === selectedAddressId);
    if (!selected) return;

    const fiscalDni = selected.customFields?.dni?.trim();
    const identityDocumentId = selected.customFields?.identityDocumentId || '1';
    if (!fiscalDni) {
      alert('Esta dirección no tiene documento/NIT para facturación. Edita la dirección y agrega los datos fiscales.');
      return;
    }
    const matiasCity = resolveMatiasCityForAddress(selected);
    if (!matiasCity) {
      alert('No se pudo asociar la ciudad/departamento de esta dirección con el catálogo de Matias. Edita la dirección y selecciona la ciudad.');
      return;
    }

    setLoading(true);
    try {
      await setShippingAddress(
        {
          fullName: selected.fullName || '',
          company: selected.company || '',
          streetLine1: selected.streetLine1,
          streetLine2: selected.streetLine2 || '',
          city: matiasCity.city,
          province: matiasCity.department,
          postalCode: selected.postalCode || '',
          countryCode: selected.country.code,
          phoneNumber: selected.phoneNumber || '',
          matiasCityId: matiasCity.id,
          dni: fiscalDni,
          identityDocumentId,
          customFields: selected.customFields || undefined,
        },
        useSameForBilling,
        fiscalDni,
        identityDocumentId,
      );
      trackAddShippingInfo({ shipping_tier: 'standard' });
      router.refresh();
      onComplete();
    } catch (error) {
      console.error('Error setting address:', error);
      if (error instanceof Error && error.message.includes('AUTH_REQUIRED')) {
        redirectToClerkSignIn();
      }
    } finally {
      setLoading(false);
    }
  };

  const onSaveNewAddress = async (data: AddressFormData) => {
    if (!ensureSignedIn()) return;
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
      if (error instanceof Error && error.message.includes('AUTH_REQUIRED')) {
        redirectToClerkSignIn();
        return;
      }
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const onSaveEditedAddress = async (data: AddressFormData) => {
    if (!ensureSignedIn()) return;
    if (!editingAddressId) return;
    setSaving(true);
    try {
      const country = countries.find(
        (c) => c.id === data.countryCode || c.code === data.countryCode,
      );
      if (!country) throw new Error('Invalid country');
      await updateCustomerAddress(editingAddressId, { ...data, countryCode: country.code });
      setDialogOpen(false);
      setEditingAddressId(null);
      reset();
      router.refresh();
    } catch (error) {
      console.error('Error updating address:', error);
      if (error instanceof Error && error.message.includes('AUTH_REQUIRED')) {
        redirectToClerkSignIn();
        return;
      }
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 pt-2">

      {addresses.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{t(I18N.Checkout.shippingAddress.selectSaved)}</p>

          <div className="space-y-2">
            {addresses.map((address) => {
              const hasCoords = hasGoogleCoordinates(address);
              const isSelected = selectedAddressId === address.id;

              return (
                <div
                  key={address.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedAddressId(address.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedAddressId(address.id);
                    }
                  }}
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

                    <div className="flex-shrink-0 flex items-start gap-2">
                      <div>
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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAddressId(address.id);
                          setDialogOpen(true);
                        }}
                        className="text-muted-foreground hover:text-[#9969F8] transition-colors"
                        title="Edit address"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedAddressId && !selectedAddressHasCoords && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Esta dirección no tiene coordenadas de Google Maps. Agrega una nueva dirección seleccionándola desde el autocomplete.</span>
        </div>
      )}

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

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSelectExistingAddress}
          isDisabled={!selectedAddressId || loading || !selectedAddressHasCoords}
          className="flex-1 rounded-xl bg-[#9969F8] text-white hover:opacity-90 transition font-semibold h-11"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t(I18N.Checkout.shippingAddress.continueWithSelected)}
        </Button>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingAddressId(null);
            reset();
          }
        }}>
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
                {editingAddressId
                  ? td(I18N.Account.addresses.form.actions.editAddress)
                  : td(I18N.Account.addresses.form.actions.addNewAddress)}
              </DialogTitle>
              <DialogDescription>
                {editingAddressId
                  ? td(I18N.Account.addresses.form.actions.updateDetails)
                  : td(I18N.Account.addresses.form.actions.fillForm)}
              </DialogDescription>
            </DialogHeader>
            <AddressForm
              key={editingAddressId || 'create'}
              countries={countries}
              defaultValues={editingAddressId ? (() => {
                const addr = addresses.find(a => a.id === editingAddressId);
                return addr ? {
                  fullName: addr.fullName || '',
                  company: addr.company || '',
                  streetLine1: addr.streetLine1,
                  streetLine2: addr.streetLine2 || '',
                  city: addr.city || '',
                  province: addr.province || '',
                  postalCode: addr.postalCode || '',
                  countryCode: addr.country.id,
                  phoneNumber: addr.phoneNumber || '',
                  matiasCityId: addr.customFields?.matiasCityId ?? undefined,
                  dni: addr.customFields?.dni ?? undefined,
                  identityDocumentId: addr.customFields?.identityDocumentId ?? '1',
                  customFields: addr.customFields || undefined,
                } : undefined;
              })() : undefined}
              googleMapsApiKey={googleMapsApiKey}
              isSubmitting={saving}
              requireGoogleCoordinates
              onSubmit={editingAddressId ? onSaveEditedAddress : onSaveNewAddress}
              onCancel={() => {
                setDialogOpen(false);
                setEditingAddressId(null);
              }}
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
