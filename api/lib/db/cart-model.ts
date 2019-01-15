import {Document, Model, Schema, Types} from 'mongoose';
import {getConnection} from './config';
import {CartItemDocument, cartItemTableName,} from './cart-item-model';

export const cartTableName = 'cart';

export interface CartEntity {
  id?: any;
  userId: string;
  customerCartId: string;
  items: Types.DocumentArray<CartItemDocument>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartDocument extends CartEntity, Document {
  toClient(): CartDocument;
}

export interface CartModel extends Model<CartDocument> {
}

export const cartSchema: Schema = new Schema(
  {
    userId: String,
    customerCartId: { type: String, index: true },
    items: [{ type: Schema.Types.ObjectId, ref: cartItemTableName }],
  },
  { strict: true, timestamps: true, useNestedStrict: true }
);

cartSchema.method('toClient', function () {
  const obj = this.toJSON();

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

let mdl;
export const getCartModel = async (): CartModel => {
  const conn = await getConnection();
  if (!mdl) {
    mdl = conn.model<CartDocument, CartModel>(cartTableName, cartSchema);
  }
  return mdl;
};
