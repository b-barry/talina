import {base} from './config';
import {AirtableApiResponse, AirtableCartItems, AirtableView} from './symbol';

const cartItemsTable = base('CartItems');

export const eqCustomerCartId = customerCartId =>
  `{customerCartId} = "${customerCartId}"`;
export const eqStripeSkuId = skuId => `{stripeSkuId} = "${skuId}"`;
export const and = (...args) => `AND(${args.join(',')})`;

export const getAllCartItemsByCartId = (
  cartId: string
): Promise<AirtableApiResponse<AirtableCartItems>[]> => {
  return cartItemsTable
    .select({
      filterByFormula: `{customerCartId} = "${cartId}"`,
      view: AirtableView.GRID,
    })
    .firstPage();
};

export const addToCart = async (
  cartId: string,
  skuId: string,
  quantity: number = 1,
): Promise<AirtableApiResponse<AirtableCartItems>> => {
  let record:
    | AirtableApiResponse<AirtableCartItems>
    | undefined;

  try {
    record = (await cartItemsTable
      .select({
        filterByFormula: and(eqCustomerCartId(cartId), eqStripeSkuId(skuId)),
        view: AirtableView.GRID,
        maxRecords: 1,
      })
      .firstPage())[0];
  } catch (e) {
    record = undefined
  }

  if (record) {
    return cartItemsTable.update(record.fields.id, {
      quantity: record.fields.quantity + 1,
    });
  }

  return cartItemsTable.create({
    stripeSkuId: skuId,
    quantity,
    customerCartId: cartId,
  });
};
