import {
  endConnection,
  fetchProducts,
  finishTransaction,
  getAvailablePurchases,
  initConnection,
  requestPurchase,
  type Product,
  type Purchase,
} from 'expo-iap';

/**
 * The app's only in-app product: a one-time, non-consumable purchase that
 * removes every ad. All devotional content is free for everyone — this buys
 * nothing except the absence of ads (and supports development).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TODO(you): create a matching **one-time product** with exactly this ID in
 * Play Console → Monetise → In-app products, then activate it. Until that
 * product exists and the app is published to at least an internal testing
 * track, `fetchRemoveAdsProduct()` will return null and the purchase button
 * stays disabled — which is the correct, honest behaviour.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const REMOVE_ADS_SKU = 'remove_ads';

let connected = false;

/** Opens the billing connection. Safe to call repeatedly. */
export async function connectStore(): Promise<boolean> {
  if (connected) return true;
  try {
    await initConnection();
    connected = true;
    return true;
  } catch (error) {
    if (__DEV__) console.warn('[billing] connection failed:', error);
    return false;
  }
}

export async function disconnectStore(): Promise<void> {
  if (!connected) return;
  try {
    await endConnection();
  } catch {
    // Nothing useful to do if teardown fails.
  }
  connected = false;
}

/**
 * Fetches the Remove Ads product so the UI can show the real, store-localised
 * price. Returns null when the product is not configured or the store is
 * unreachable — callers must treat null as "purchasing is unavailable" rather
 * than falling back to a hardcoded price. Showing a price we did not get from
 * Play is exactly the Payments-policy problem this replaced.
 */
export async function fetchRemoveAdsProduct(): Promise<Product | null> {
  if (!(await connectStore())) return null;
  try {
    const products = await fetchProducts({ skus: [REMOVE_ADS_SKU], type: 'in-app' });
    const list = (products ?? []) as Product[];
    return list.find((p) => p.id === REMOVE_ADS_SKU) ?? null;
  } catch (error) {
    if (__DEV__) console.warn('[billing] fetchProducts failed:', error);
    return null;
  }
}

/**
 * Starts the Play purchase flow.
 *
 * The result does NOT arrive from this call — it arrives asynchronously on the
 * purchase listener. Callers must not treat a resolved promise as a successful
 * purchase.
 */
export async function purchaseRemoveAds(): Promise<void> {
  if (!(await connectStore())) throw new Error('Store unavailable');
  await requestPurchase({
    request: {
      google: { skus: [REMOVE_ADS_SKU] },
      apple: { sku: REMOVE_ADS_SKU },
    },
    type: 'in-app',
  });
}

/**
 * Acknowledges a purchase with the store.
 *
 * Critical on Android: a purchase that is not finalised within 3 days is
 * automatically refunded by Google, which would silently revoke the user's
 * ad-free status.
 */
export async function acknowledgePurchase(purchase: Purchase): Promise<void> {
  try {
    await finishTransaction({ purchase, isConsumable: false });
  } catch (error) {
    if (__DEV__) console.warn('[billing] finishTransaction failed:', error);
  }
}

/**
 * Returns whether the user currently owns Remove Ads, and acknowledges the
 * purchase if Play is still waiting for that.
 *
 * Used both at launch (so a reinstall restores the entitlement automatically)
 * and behind the explicit "Restore purchase" button that Play requires.
 */
export async function ownsRemoveAds(): Promise<boolean> {
  if (!(await connectStore())) return false;
  try {
    const purchases = (await getAvailablePurchases()) as Purchase[];
    const owned = purchases.filter(
      (p) => p.productId === REMOVE_ADS_SKU && p.purchaseState === 'purchased',
    );
    for (const purchase of owned) {
      await acknowledgePurchase(purchase);
    }
    return owned.length > 0;
  } catch (error) {
    if (__DEV__) console.warn('[billing] getAvailablePurchases failed:', error);
    return false;
  }
}
