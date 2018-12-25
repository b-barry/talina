const CartItems = require('airtable');

CartItems.configure({ apiKey: process.env.airtable_api_key });
export const base = CartItems.base(
  process.env.airtable_base_id
);


