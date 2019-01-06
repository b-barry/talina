import {stripe} from './config';
import {webhooks} from 'stripe';

export const validateHookData = async <T> (rawBody: any, signature, secret): Promise<webhooks.StripeWebhookEvent<T>> => {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    secret
  );
};
