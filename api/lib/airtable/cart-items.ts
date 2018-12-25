import {base} from './config';
import {AirtableApiResponse, AirtableCartItems, AirtableView} from './symbol';

const cartItemsTable = base('CartItems');

export const getAllCartItemsByCartId = (
  cartId: string
): Promise<AirtableApiResponse<AirtableCartItems>[]> => {
  return cartItemsTable
    .select({ filterByFormula: `{customerCartId} = "${cartId}"`, view: AirtableView.GRID })
    .firstPage();
};
