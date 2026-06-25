const STAGE_SELLERS = 'https://stg.ecommer.shop/sellers';
const PROD_SELLERS = 'https://ecommer.shop/sellers';

/**
 * URL del landing de onboarding de vendedores.
 * - Override: NEXT_PUBLIC_SELLERS_LANDING_URL
 * - Si NEXT_PUBLIC_SITE_URL incluye "stg" → Stage; si no → Producción
 */
export function getSellersLandingUrl(): string {
  const override = process.env.NEXT_PUBLIC_SELLERS_LANDING_URL;
  if (override) return override;

  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  try {
    const host = new URL(site || PROD_SELLERS).hostname;
    return host.includes('stg') ? STAGE_SELLERS : PROD_SELLERS;
  } catch {
    return PROD_SELLERS;
  }
}

const BILLING_STG = 'https://admin-stg.ecommer.shop/dashboard/billing';
const BILLING_PROD = 'https://admin.ecommer.shop/dashboard/billing';

const SHOP_STG = 'https://admin-stg.ecommer.shop/dashboard/';
const SHOP_PROD = 'https://admin.ecommer.shop/dashboard/';

export function getBillingAdminUrl(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  try {
    const host = new URL(site).hostname;
    return host.includes('stg') ? BILLING_STG : BILLING_PROD;
  } catch {
    return BILLING_PROD;
  }
}

export function getAdminUrl(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  try {
    const host = new URL(site).hostname;
    return host.includes('stg') ? SHOP_STG : SHOP_PROD;
  } catch {
    return SHOP_PROD;
  }
}
