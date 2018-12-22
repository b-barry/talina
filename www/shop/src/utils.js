export function flatten(arr = []) {
  return Array.prototype.concat(...arr)
}

export function groupBy(list = [], keyGetter = () => {}) {
  return list.reduce(function(rv, x) {
    const key = keyGetter(x)
    ;(rv[key] = rv[key] || []).push(x)
    return rv
  }, {})
}

export function priceFormat(value, country = 'fr-BE', divideBy100 = true) {
  return new Intl.NumberFormat(country, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(divideBy100 ? parseInt(value, 10) / 100 : parseInt(value, 10))
}
