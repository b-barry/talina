import { parseJSON, responseJson, to } from '../lib/util';
import { create } from '../lib/stripe/customers';

module.exports = async (req, res) => {
  const { method, body: rawBody } = req;
  if (method !== 'POST') {
    responseJson(res, { error: 'HTTP Method POST is required' }, 400);
    return;
  }

  const body = parseJSON(rawBody);
  const [err, customer] = await to(create(body));
  if (err) {
    console.log('create-customer', err);
    responseJson(res, { error: 'Customer creation failed' }, 400);
    return;
  }

  responseJson(res, customer);
};
