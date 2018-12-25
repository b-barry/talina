import {responseJson} from '../lib/util';

module.exports = (req, res) => {
    responseJson(res, {
        up: true
    })
};
