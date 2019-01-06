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
import { Charge } from '../order/symbol';

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
      process.env.stripe_webhook_charge_source_failed_secret
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
      (object.object === 'source' || object.object === 'charge') &&
      (object.status === 'failed' || object.status === 'canceled')
    )
  ) {
    console.log(`⚠️  Webhook event incorrect`, object);
    return responseError(
      res,
      createError(400, `⚠️ Webhook event incorrect -> ${object.status}`)
    );
  }

  const source = object.source ? object.source : object;
  console.log(`🔔  Webhook received! Failure for ${object.id}.`);
  if (!source.metadata.order) {
    console.log(`⚠️  Webhook: no order in source`, source);
    return responseError(
      res,
      createError(400, `⚠️  Webhook: no order in source`)
    );
  }

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

  const status = 'failed';

  const [updateOrderError, updatedOrder] = await to(
    update(order.id, {
      metadata: { status },
    })
  );

  if (updateOrderError) {
    return responseError(
      res,
      createError(
        403,
        `Impossible to update Order with id ${order.id} to status="${status}"`
      )
    );
  }

  return responseJson(res, { order: updatedOrder }, 200);
};
