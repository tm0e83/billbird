export function toCurrency(num) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: "EUR"
  }).format(num);
}