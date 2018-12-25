import {responseJson} from '../lib/util';
import {getAllCartItemsByCartId} from '../lib/airtable';

module.exports = async (req, res) => {
  responseJson(res, await getAllCartItemsByCartId('lol'));
};
