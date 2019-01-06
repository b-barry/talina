import { stripe } from './config';
import { Charge, CreateCharge } from '../../order/symbol';

export const create = ({
  sourceId,
  email,
  amount,
  currency,
  idempotencyKey,
}: CreateCharge): Promise<Charge> => {
  return stripe.charges.create(
    {
      source: sourceId,
      currency,
      amount,
      receipt_email: email,
    },
    { idempotency_key: idempotencyKey }
  );
};
