import { query } from '../api';
import { GetActiveCustomerQuery } from '../../shared/queries';
import { getActiveChannelCached } from '../../cached';
import { cache } from "react";
import { readFragment } from "@/graphql";
import { ActiveCustomerFragment } from "@/lib/vendure/shared/fragments";
import { getAuthToken } from "@/lib/vendure/server/auth";
import { currentUser } from '@clerk/nextjs/server';
import { RegisterCustomerAccountMutation, VerifyCustomerAccountMutation } from '../../shared/mutations';


export const getActiveCustomer = cache(async () => {
  const token = await getAuthToken();
  const result = await query(GetActiveCustomerQuery, undefined, {
    token
  });
  return readFragment(ActiveCustomerFragment, result.data.activeCustomer);
})

export const getActiveChannel = getActiveChannelCached;

export async function registerVendureCustomer() {
  const user = await currentUser();

  if (!user) return;

  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) return;

  await query(RegisterCustomerAccountMutation, {
    input: {
      emailAddress: email,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
    },
  });
}

export async function verifyVendureCustomer(token: string) {
  await query(VerifyCustomerAccountMutation, {
    token,
    password: null,
  });
}