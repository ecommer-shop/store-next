'use client';

import { Suspense, useState } from 'react';
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

interface Country {
    id: string;
    code: string;
    name: string;
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
};

export type UpdateAddressPayload = CreateAddressPayload & {
  id: string;
};


export function AddressesClient({ addresses, countries } : AddressesClientProps) {
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
    const country = countries.find(c => c.id === data.countryId);
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
      countryCode: country.code, // ✅
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
                    Add new address
                </Button>
            </div>

            {addresses.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground mb-4">No addresses saved yet</p>
                        <Button onClick={handleAddNew}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add your first address
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <Card key={address.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1 flex-1">
                                        <CardTitle className="text-lg">{address.fullName}</CardTitle>
                                        {(address.defaultShippingAddress || address.defaultBillingAddress) && (
                                            <div className="flex gap-2">
                                                {address.defaultShippingAddress && (
                                                    <Badge variant="secondary">Default Shipping</Badge>
                                                )}
                                                {address.defaultBillingAddress && (
                                                    <Badge variant="secondary">Default Billing</Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="md"
                                                aria-label="Address actions"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className='cursor-pointer' onClick={() => handleEdit(address)}>
                                                <Edit2 className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className='cursor-pointer'
                                                onClick={() => handleSetDefaultShipping(address.id)}
                                                disabled={
                                                    address.defaultShippingAddress ||
                                                    (settingDefault?.id === address.id && settingDefault?.type === 'shipping')
                                                }
                                            >
                                                <Home className="mr-2 h-4 w-4" />
                                                {address.defaultShippingAddress ? 'Default Shipping' : 'Set as Shipping'}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className='cursor-pointer'
                                                onClick={() => handleSetDefaultBilling(address.id)}
                                                disabled={
                                                    address.defaultBillingAddress ||
                                                    (settingDefault?.id === address.id && settingDefault?.type === 'billing')
                                                }
                                            >
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                {address.defaultBillingAddress ? 'Default Billing' : 'Set as Billing'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(address.id)}
                                                className="cursor-pointer text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    {address.company && <p>{address.company}</p>}
                                    <p>
                                        {address.streetLine1}
                                        {address.streetLine2 && `, ${address.streetLine2}`}
                                    </p>
                                    <p>
                                        {address.city}, {address.province} {address.postalCode}
                                    </p>
                                    <p>{address.country.name}</p>
                                    <p>{address.phoneNumber}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? 'Edit address' : 'Add new address'}</DialogTitle>
                        <DialogDescription>
                            {editingAddress
                                ? 'Update the details of your address'
                                : 'Fill in the form below to add a new address'}
                        </DialogDescription>
                    </DialogHeader>
                    <AddressForm
                        countries={countries}
                        address={editingAddress || undefined}
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
                        <AlertDialog.CloseTrigger/>
                        <AlertDialog.Header>
                        <AlertDialog.Heading>
                            <AlertDialog.Icon status='danger'/>
                            Are you sure?
                        
                        This action cannot be undone. This will permanently delete this address.
                        </AlertDialog.Heading>
                        
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                        <Button 
                        className="rounded-md"
                        slot="close" variant='danger-soft' isDisabled={isDeleting}>Cancel</Button>
                        <Button 
                        className="rounded-md"
                        variant='primary' onClick={confirmDelete} aria-disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
                </AlertDialog.Backdrop>
            </AlertDialog>
            
        </>
    );
}