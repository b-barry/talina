import {responseJson, to} from '../lib/util';
import parse from 'url-parse';
import {getById} from '../lib/stripe/orders';

module.exports = async (req, res) => {
  const { query } = parse(req.url || '', true);
  if (!query || !query.id) {
    return responseJson(res, { error: 'Id is required' }, 400);
  }


  const [err, record] = await to(getById(query.id));
  if (err) {
    return responseJson(res, { error: `Impossible to get the order with id ${query.id}` }, 400);
  }
  responseJson(res, record);
};
