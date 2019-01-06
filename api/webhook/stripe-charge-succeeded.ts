import {isOptions, isPostRequest, responseError, responseJson, to,} from '../lib/util';
import {buffer, createError} from '../lib/http/micro';
import {validateHookData} from '../lib/stripe/webhook';
import {getById, update} from '../lib/stripe/orders';
import {Charge} from '../order/symbol';

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
      process.env.stripe_webhook_charge_succeeded_secret
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
      object.object === 'charge' &&
      object.status === 'succeeded' &&
      object.source.metadata.order
    )
  ) {
    console.log(`⚠️  Webhook event incorrect`, object);
    return responseError(
      res,
      createError(400, `⚠️ Webhook event incorrect -> ${object.status}`)
    );
  }

  const charge: Charge = object;
  console.log(`🔔  Webhook received! The charge ${charge.id} succeeded.`);
  // Find the corresponding order this source is for by looking in its metadata.
  const [getByIdError, order] = await to(getById(charge.source.metadata.order));

  if (getByIdError) {
    console.log(
      `⚠️  Webhook: impossible to retrieve order ${charge.source.metadata.order}`,
      getByIdError
    );
    return responseError(
      res,
      createError(
        400,
        `⚠️  Webhook: impossible to retrieve order ${charge.source.metadata.order}`
      )
    );
  }

  const status = 'paid';

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
