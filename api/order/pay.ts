import {isOptions, isPost, responseError, responseJson, to,} from '../lib/util';
import {getById, update} from '../lib/stripe/orders';
import {createError} from '../lib/http/micro';
import {ChargeStatus, OrderStatus, SourceStatus} from './symbol';
import {create} from '../lib/stripe/charges';

module.exports = async (req, res) => {
  if (isOptions(req)) {
    return responseJson(res, {});
  }
  const [postError, body] = await to(isPost(req));
  if (postError) {
    return responseError(res, postError);
  }
  const { source, orderId } = body;
  const [getByIdError, order] = await to(getById(orderId));

  if (getByIdError) {
    return responseError(res, createError(404, `Order not found`));
  }

  // Verify that this order actually needs to be paid.
  if (
    order.metadata.status === OrderStatus.PENDING ||
    order.metadata.status === OrderStatus.PAID
  ) {
    return responseError(
      res,
      createError(403, `Order is already paid or pending`)
    );
  }

  if (source && source.status !== SourceStatus.CHARGEABLE) {
    return responseError(res, createError(403, `Source is not chargeable`));
  }

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

  const [updateOrderError, updatedOrder] = await to(update(orderId, {
    metadata: { status },
  }));

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
