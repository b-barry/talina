import { parseJSON, responseJson, to } from '../lib/util';

module.exports = async (req, res) => {
  const { method, body: rawBody } = req;
  if (method !== 'POST') {
    responseJson(res, { error: 'HTTP Method POST is required' }, 400);
    return;
  }

  const body = parseJSON(rawBody);

  responseJson(res, {});
};
