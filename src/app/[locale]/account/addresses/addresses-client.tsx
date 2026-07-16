'use client';

import { Suspense, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDialog, Button } from '@heroui/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Home, CreditCard, Edit2, Trash2 } from 'lucide-react';
import { AddressForm, AddressFormData } from './address-form';
import { createAddress, updateAddress, deleteAddress, setDefaultShippingAddress, setDefaultBillingAddress } from './actions';
import { useRouter } from 'next/navigation';
import { I18N } from '@/i18n/keys';

interface Country {
    id: string;
    code: string;
    name: string;
}

export interface CustomerAddress {
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
    customFields?: {
        matiasCityId?: string | null;
        dni?: string | null;
        identityDocumentId?: string | null;
    } | null;
    defaultShippingAddress?: boolean | null;
    defaultBillingAddress?: boolean | null;
}

interface AddressesClientProps {
    addresses: CustomerAddress[];
    countries: Country[];
}

export type CreateAddressPayload = {
    fullName?: string;
    company?: string;
    streetLine1: string;
    streetLine2?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    phoneNumber?: string;
    countryCode: string;
    matiasCityId?: string;
    dni?: string;
    identityDocumentId?: string;
    customFields?: {
        matiasCityId?: string;
        dni?: string;
        identityDocumentId?: string;
    };
};

export type UpdateAddressPayload = CreateAddressPayload & {
    id: string;
};


export function AddressesClient({ addresses, countries }: AddressesClientProps) {
    const t = useTranslations('Account.addresses');
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [settingDefault, setSettingDefault] = useState<{ id: string; type: 'shipping' | 'billing' } | null>(null);

    const handleAddNew = () => {
        setEditingAddress(null);
        setDialogOpen(true);
    };

    const handleEdit = (address: CustomerAddress) => {
        setEditingAddress(address);
        setDialogOpen(true);
    };

    const handleDelete = (addressId: string) => {
        setAddressToDelete(addressId);
        setDeleteDialogOpen(true);
    };

    const handleSetDefaultShipping = async (addressId: string) => {
        setSettingDefault({ id: addressId, type: 'shipping' });
        try {
            await setDefaultShippingAddress(addressId);
            router.refresh();
        } catch (error) {
            console.error('Error setting default shipping address:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setSettingDefault(null);
        }
    };

    const handleSetDefaultBilling = async (addressId: string) => {
        setSettingDefault({ id: addressId, type: 'billing' });
        try {
            await setDefaultBillingAddress(addressId);
            router.refresh();
        } catch (error) {
            console.error('Error setting default billing address:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setSettingDefault(null);
        }
    };

    const confirmDelete = async () => {
        if (!addressToDelete) return;

        setIsDeleting(true);
        try {
            await deleteAddress(addressToDelete);
            router.refresh();
            setDeleteDialogOpen(false);
            setAddressToDelete(null);
        } catch (error) {
            console.error('Error deleting address:', error);
            alert(`Error deleting address: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSubmit = async (data: AddressFormData) => {
        setIsSubmitting(true);

        try {
            const country = countries.find(c => c.id === data.countryCode || c.code === data.countryCode);
            if (!country) throw new Error('Invalid country');

            const baseInput: CreateAddressPayload = {
                fullName: data.fullName,
                company: data.company,
                streetLine1: data.streetLine1,
                streetLine2: data.streetLine2,
                city: data.city,
                province: data.province,
                postalCode: data.postalCode,
                phoneNumber: data.phoneNumber,
                countryCode: country.code,
                matiasCityId: data.matiasCityId,
                dni: data.dni,
                identityDocumentId: data.identityDocumentId,
            };

            if (editingAddress) {
                const updateInput: UpdateAddressPayload = {
                    id: editingAddress.id,
                    ...baseInput,
                };
                await updateAddress(updateInput);
            } else {
                await createAddress(baseInput);
            }

            router.refresh();
            setDialogOpen(false);
            setEditingAddress(null);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <>
            <div className="flex justify-between items-center">
                <div></div>
                <Button onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t(I18N.Account.addresses.form.actions.addAddress)}
                </Button>
            </div>

            {addresses.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground mb-4">{t(I18N.Account.addresses.form.actions.noAddresses)}</p>
                        <Button onClick={handleAddNew}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t(I18N.Account.addresses.form.actions.addFirstAddress)}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address, index) => (
                        <div
                            key={address.id}
                            className={`relative group rounded-2xl border bg-background shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-3
                                ${address.defaultShippingAddress || address.defaultBillingAddress
                                    ? 'border-[#9969F8]/40 ring-1 ring-[#9969F8]/20'
                                    : 'border-border hover:border-[#9969F8]/30'
                                }`}
                        >
                            {/* Label numerado */}
                            <span className="absolute -top-2.5 left-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#9969F8] text-white shadow-sm">
                                Dirección {index + 1}
                            </span>

                            {/* Header: nombre + menú */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground text-base truncate">
                                        {address.fullName}
                                    </p>
                                    {/* Badges */}
                                    {(address.defaultShippingAddress || address.defaultBillingAddress) && (
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {address.defaultShippingAddress && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#9969F8]/10 text-[#9969F8] border border-[#9969F8]/20">
                                                    <Home className="h-2.5 w-2.5" />
                                                    {t(I18N.Account.addresses.form.actions.defaultShipping)}
                                                </span>
                                            )}
                                            {address.defaultBillingAddress && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                    <CreditCard className="h-2.5 w-2.5" />
                                                    {t(I18N.Account.addresses.form.actions.defaultBilling)}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Menú de acciones */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                                            aria-label="Address actions"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(address)}>
                                            <Edit2 className="mr-2 h-4 w-4" />
                                            {t(I18N.Account.addresses.form.actions.edit)}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => handleSetDefaultShipping(address.id)}
                                            disabled={
                                                address.defaultShippingAddress ||
                                                (settingDefault?.id === address.id && settingDefault?.type === 'shipping')
                                            }
                                        >
                                            <Home className="mr-2 h-4 w-4" />
                                            {address.defaultShippingAddress
                                                ? t(I18N.Account.addresses.form.actions.defaultShipping)
                                                : t(I18N.Account.addresses.form.actions.setAsShipping)}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => handleSetDefaultBilling(address.id)}
                                            disabled={
                                                address.defaultBillingAddress ||
                                                (settingDefault?.id === address.id && settingDefault?.type === 'billing')
                                            }
                                        >
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            {address.defaultBillingAddress
                                                ? t(I18N.Account.addresses.form.actions.defaultBilling)
                                                : t(I18N.Account.addresses.form.actions.setAsBilling)}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(address.id)}
                                            className="cursor-pointer text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                            {t(I18N.Account.addresses.form.actions.delete)}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Separador */}
                            <div className="h-px bg-border" />

                            {/* Contenido de la dirección */}
                            <div className="space-y-1 text-sm text-muted-foreground">
                                {address.company && (
                                    <p className="font-medium text-foreground/80">{address.company}</p>
                                )}
                                <p className="leading-snug">
                                    {address.streetLine1}
                                    {address.streetLine2 && (
                                        <span className="text-muted-foreground/70">, {address.streetLine2}</span>
                                    )}
                                </p>
                                <p>
                                    {address.city}{address.province && `, ${address.province}`}
                                    {address.postalCode && (
                                        <span className="ml-1 text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                            {address.postalCode}
                                        </span>
                                    )}
                                </p>
                                <p className="text-muted-foreground/70">{address.country.name}</p>
                                {address.phoneNumber && (
                                    <p className="font-medium text-foreground/70 pt-0.5">
                                        📞 {address.phoneNumber}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? t(I18N.Account.addresses.form.actions.editAddress) : t(I18N.Account.addresses.form.actions.addNewAddress)}</DialogTitle>
                        <DialogDescription>
                            {editingAddress
                                ? t(I18N.Account.addresses.form.actions.updateDetails)
                                : t(I18N.Account.addresses.form.actions.fillForm)}
                        </DialogDescription>
                    </DialogHeader>
                    <AddressForm
                        countries={countries}
                        defaultValues={editingAddress ? {
                            fullName: editingAddress.fullName ?? '',
                            company: editingAddress.company ?? '',
                            streetLine1: editingAddress.streetLine1,
                            streetLine2: editingAddress.streetLine2 ?? '',
                            city: editingAddress.city ?? '',
                            province: editingAddress.province ?? '',
                            postalCode: editingAddress.postalCode ?? '',
                            countryCode: editingAddress.country.code,
                            phoneNumber: editingAddress.phoneNumber ?? '',
                            matiasCityId: editingAddress.customFields?.matiasCityId ?? undefined,
                            dni: editingAddress.customFields?.dni ?? undefined,
                            identityDocumentId: editingAddress.customFields?.identityDocumentId ?? '1',
                        } : undefined}
                        labels={{
                            fullName: t(I18N.Account.addresses.form.fields.fullName.label),
                            company: t(I18N.Account.addresses.form.fields.company.label),
                            streetLine1: t(I18N.Account.addresses.form.fields.streetLine1.label),
                            streetLine2: t(I18N.Account.addresses.form.fields.streetLine2.label),
                            city: t(I18N.Account.addresses.form.fields.city.label),
                            province: t(I18N.Account.addresses.form.fields.province.label),
                            postalCode: t(I18N.Account.addresses.form.fields.postalCode.label),
                            country: t(I18N.Account.addresses.form.fields.countryCode.label),
                            phoneNumber: t(I18N.Account.addresses.form.fields.phoneNumber.label),
                            cancel: t(I18N.Account.addresses.form.actions.cancel),
                            submit: t(I18N.Account.addresses.form.actions.save),
                        }}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setDialogOpen(false);
                            setEditingAddress(null);
                        }}
                        isSubmitting={isSubmitting}
                    />
                </DialogContent>
            </Dialog>
            <AlertDialog isOpen={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialog.Backdrop variant='blur' style={{
                    height: "100%"
                }}>
                    <AlertDialog.Container>
                        <AlertDialog.Dialog className='w-sm rounded-md'>
                            <AlertDialog.CloseTrigger />
                            <AlertDialog.Header>
                                <AlertDialog.Heading>
                                    <AlertDialog.Icon status='danger' />
                                    {t(I18N.Account.addresses.form.actions.areYouSure)}

                                    {t(I18N.Account.addresses.form.actions.deleteWarning)}
                                </AlertDialog.Heading>

                            </AlertDialog.Header>
                            <AlertDialog.Footer>
                                <Button
                                    className="rounded-md"
                                    slot="close" variant='danger-soft' isDisabled={isDeleting}>{t(I18N.Account.addresses.form.actions.cancel)}</Button>
                                <Button
                                    className="rounded-md"
                                    variant='primary' onClick={confirmDelete} aria-disabled={isDeleting}>
                                    {isDeleting ? t(I18N.Account.addresses.form.actions.deleting) : t(I18N.Account.addresses.form.actions.delete)}
                                </Button>
                            </AlertDialog.Footer>
                        </AlertDialog.Dialog>
                    </AlertDialog.Container>
                </AlertDialog.Backdrop>
            </AlertDialog>

        </>
    );
}