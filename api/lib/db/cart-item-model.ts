import { Document, Model, Schema } from 'mongoose';
import { getConnection } from './config';
import { CartEntity, cartTableName } from './cart-model';

export const cartItemTableName = 'cart-item';

export interface CartItemEntity {
  id?: any;
  skuId: string;
  quantity: number;
  cart: CartEntity | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemDocument extends CartItemEntity, Document {
  toClient(): CartItemDocument;
}

export interface CartItemModel extends Model<CartItemDocument> {}

export const cartItemSchema: Schema = new Schema(
  {
    skuId: String,
    quantity: Number,
    cart: { type: Schema.Types.ObjectId, ref: cartTableName },
  },
  { strict: true, timestamps: true, useNestedStrict: true }
);

cartItemSchema.method('toClient', function() {
  const obj = this.toJSON();

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

let mdl;

export const getCartItemModel = async (): Promise<CartItemModel> => {
  const conn = await getConnection();
  if (!mdl) {
    mdl = conn.model<CartItemDocument, CartItemModel>(
      cartItemTableName,
      cartItemSchema
    );
  }
  return mdl;
};
