import {
  isOptions,
  isPostRequest,
  responseError,
  responseJson,
  to,
} from '../lib/util';
import { buffer, createError } from '../lib/http/micro';
import { validateHookData } from '../lib/stripe/webhook';
import { getById, update } from '../lib/stripe/orders';
import { create } from '../lib/stripe/charges';
import { ChargeStatus, OrderStatus } from '../order/symbol';

module.exports = async (req, res) => {
  if (isOptions(req)) {
    return responseJson(res, {});
  }
  if (!isPostRequest(req)) {
    return responseError(res, createError(400, 'Post request required'));
  }

  const [err, rawBody] = await to(buffer(req));
  if (err) {
    console.log(`⚠️  Webhook: getting rawBody failed`, err);
    return responseError(
      res,
      createError(400, `⚠️  Webhook: getting rawBody failed`)
    );
  }

  let signature = req.headers['stripe-signature'];
  const [validationError, event] = await to(
    validateHookData<any>(
      rawBody,
      signature,
      process.env.stripe_webhook_source_chargeable_secret
    )
  );

  if (validationError) {
    console.log(`⚠️  Webhook signature verification failed.`, validationError);
    return responseError(
      res,
      createError(400, `⚠️  Webhook signature verification failed.`)
    );
  }
  console.log(`Webhook event`, event);
  const {
    data: { object },
  } = event;

  if (
    !(
      object.object === 'source' &&
      object.status === 'chargeable' &&
      object.metadata.order
    )
  ) {
    console.log(`⚠️  Webhook event incorrect`);
    return responseError(
      res,
      createError(400, `⚠️ Webhook event incorrect -> ${object.status}`)
    );
  }

  const source = object;
  console.log(`🔔  Webhook received! The source ${source.id} is chargeable.`);
  // Find the corresponding order this source is for by looking in its metadata.
  const [getByIdError, order] = await to(getById(source.metadata.order));

  if (getByIdError) {
    console.log(
      `⚠️  Webhook: impossible to retrieve order ${source.metadata.order}`,
      getByIdError
    );
    return responseError(
      res,
      createError(
        400,
        `⚠️  Webhook: impossible to retrieve order ${source.metadata.order}`
      )
    );
  }
  // Verify that this order actually needs to be paid.
  if (
    order.metadata.status === 'pending' ||
    order.metadata.status === 'paid' ||
    order.metadata.status === 'failed'
  ) {
    console.log(
      `⚠️ Webhook: order ${source.metadata.order} don't need to be paid`
    );
    return responseError(
      res,
      createError(
        403,
        `⚠️  Webhook: order ${source.metadata.order} don't need to be paid`
      )
    );
  }
  const orderId = source.metadata.order;

  const [createChargeError, charge] = await to(
    create({
      sourceId: source.id,
      amount: order.amount,
      currency: order.currency,
      email: order.email,
      idempotencyKey: orderId,
    })
  );

  let status: string;
  if (createChargeError || !charge) {
    status = OrderStatus.FAILED;
  }

  if (charge) {
    status =
      charge.status === ChargeStatus.SUCCEEDED
        ? OrderStatus.PAID
        : charge.status;
  }

  const [updateOrderError, updatedOrder] = await to(
    update(orderId, {
      metadata: { status },
    })
  );

  if (updateOrderError) {
    return responseError(
      res,
      createError(
        403,
        `Impossible to update Order with id ${orderId} to status="${status}"`
      )
    );
  }

  return responseJson(res, { order: updatedOrder, source }, 200);
};
