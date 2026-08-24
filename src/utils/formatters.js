export const VALID_PROMO_CODES = {
  LUNAR15: { discountPercent: 15, label: '15% Off Lunar Welcome' },
  ECLIPSE20: { discountPercent: 20, label: '20% Off VIP Eclipse Drop' },
  VIP10: { discountPercent: 10, label: '10% Off Member Access' },
};

export const FREE_SHIPPING_THRESHOLD = 250;

export function formatPrice(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
