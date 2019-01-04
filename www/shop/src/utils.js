import cuid from 'cuid';

export function flatten(arr = []) {
  return Array.prototype.concat(...arr);
}

export function groupBy(list = [], keyGetter = () => {}) {
  return list.reduce(function(rv, x) {
    const key = keyGetter(x);
    (rv[key] = rv[key] || []).push(x);
    return rv;
  }, {});
}

export function priceFormat(value, country = 'fr-BE', divideBy100 = true) {
  return new Intl.NumberFormat(country, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(divideBy100 ? parseInt(value, 10) / 100 : parseInt(value, 10));
}

export const sumCartQuantities = (cart = []) =>
  cart.reduce((acc, next) => acc + next.quantity, 0);
export const sumCartPrices = (cart = []) =>
  cart.reduce((acc, next) => acc + next.sku.price * next.quantity, 0);

export function range(size, startAt = 0) {
  return Array.from(Array(10).keys()).map(i => i + startAt);
}

export const isNull = value => value === null;

export const isProductionEnvironment = () =>
  !process.env.api_base_url.includes('localhost');

export const generateCartId = () => {
  return cuid();
};

export const getTotalPrice = (subtotal, shippingFee, isShippingFree = false) => {
  let fee = 0
  if (!isShippingFree) {
    fee = shippingFee
  }
  return `${parseInt(subtotal, 10) + parseInt(fee, 10)}`
}

export const nope=()=>{};

export const mb=p=>o=>p.map(c=>o=(o||{})[c])&&o

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to(promise, errorExt) {
  return promise
    .then(data => [null, data])
    .catch(err => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }

      return [err, undefined];
    });
}
