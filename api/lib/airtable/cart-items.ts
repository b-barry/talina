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

export const findOneBy = async (
  filterByFormula = '',
  view = AirtableView.GRID
): Promise<AirtableApiResponse<AirtableCartItems>> => {
  let record: AirtableApiResponse<AirtableCartItems> | undefined;

  try {
    record = (await cartItemsTable
      .select({
        filterByFormula,
        view,
        maxRecords: 1,
      })
      .firstPage())[0];
  } catch (e) {
    record = undefined;
  }

  return record;
};
export const addToCart = async (
  cartId: string,
  skuId: string,
  quantity: number = 1
): Promise<AirtableApiResponse<AirtableCartItems>> => {
  let record:
    | AirtableApiResponse<AirtableCartItems>
    | undefined = await findOneBy(
    and(eqCustomerCartId(cartId), eqStripeSkuId(skuId))
  );

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

export const updateQuantity = async (
  cartId: string,
  skuId: string,
  quantity: number = 1
): Promise<AirtableApiResponse<AirtableCartItems>> => {
  let record:
    | AirtableApiResponse<AirtableCartItems>
    | undefined = await findOneBy(
    and(eqCustomerCartId(cartId), eqStripeSkuId(skuId))
  );
  if (quantity <= 0) {
    quantity = 1;
  }

  if (record) {
    return cartItemsTable.update(record.fields.id, {
      quantity,
    });
  }
};

export const removeById = async (id: string): Promise<boolean> => {
  try {
    await cartItemsTable.destroy(id);
    return true;
  } catch (e) {
    return false;
  }
};

export const removeByCartIdAndSkuId = async (
  cartId: string,
  skuId: string
): Promise<boolean> => {
  let record:
    | AirtableApiResponse<AirtableCartItems>
    | undefined = await findOneBy(
    and(eqCustomerCartId(cartId), eqStripeSkuId(skuId))
  );

  if (record) {
    return removeById(record.fields.id);
  }

  return false;
};
