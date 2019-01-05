import {responseJson, to} from '../lib/util';
import parse from 'url-parse';
import {getById} from '../lib/stripe/orders';

module.exports = async (req, res) => {
  const { query } = parse(req.url || '', true);
  if (!query || !query.id) {
    responseJson(res, { error: 'Id is required' }, 400);
    return;
  }


  const [err, record] = await to(getById(query.id));
  if (err) {
    responseJson(res, { error: `Impossible to get the order with id ${query.id}` }, 400);
    return;
  }
  responseJson(res, record);
};
