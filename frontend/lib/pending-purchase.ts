export interface PendingPurchase {
  nftId: string;
  buyerWallet: string;
  transactionSignature: string;
  createdAt: string;
}

const STORAGE_PREFIX = "nova:pending-purchase";

function getStorageKey(nftId: string, buyerWallet: string) {
  return `${STORAGE_PREFIX}:${nftId}:${buyerWallet}`;
}

export function savePendingPurchase(purchase: PendingPurchase): boolean {
  try {
    localStorage.setItem(
      getStorageKey(purchase.nftId, purchase.buyerWallet),
      JSON.stringify(purchase),
    );

    return true;
  } catch {
    return false;
  }
}

export function getPendingPurchase(
  nftId: string,
  buyerWallet: string,
): PendingPurchase | null {
  try {
    const stored = localStorage.getItem(getStorageKey(nftId, buyerWallet));

    if (!stored) return null;

    const purchase = JSON.parse(stored) as PendingPurchase;

    if (
      purchase.nftId !== nftId ||
      purchase.buyerWallet !== buyerWallet ||
      !purchase.transactionSignature
    ) {
      return null;
    }

    return purchase;
  } catch {
    return null;
  }
}

export function clearPendingPurchase(
  nftId: string,
  buyerWallet: string,
  transactionSignature: string,
) {
  try {
    const key = getStorageKey(nftId, buyerWallet);
    const stored = localStorage.getItem(key);

    if (!stored) return;

    const purchase = JSON.parse(stored) as PendingPurchase;

    // Only clear the exact transaction that was successfully recorded.
    if (purchase.transactionSignature === transactionSignature) {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage errors; backend purchase recording remains authoritative.
  }
}
