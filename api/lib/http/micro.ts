const contentType = require('content-type');
const getRawBody = require('raw-body');
const { readable } = require('is-stream');

const { NODE_ENV } = process.env;
const DEV = NODE_ENV === 'development';

export type HttpErrorResponse = Error & { statusCode?; originalError? };

export const createError = (code, message, original?) => {
  const err: HttpErrorResponse = new Error(message);

  err.statusCode = code;
  err.originalError = original;

  return err;
};

export const send = (res, code, obj = null) => {
  res.statusCode = code;

  if (obj === null) {
    res.end();
    return;
  }

  if (Buffer.isBuffer(obj)) {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/octet-stream');
    }

    res.setHeader('Content-Length', obj.length);
    res.end(obj);
    return;
  }

  if (readable(obj)) {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/octet-stream');
    }

    obj.pipe(res);
    return;
  }

  let str = obj;

  if (typeof obj === 'object' || typeof obj === 'number') {
    if (DEV) {
      str = JSON.stringify(obj, null, 2);
    } else {
      str = JSON.stringify(obj);
    }

    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
  }

  res.setHeader('Content-Length', Buffer.byteLength(str));
  res.end(str);
};

export const sendError = (req, res, errorObj) => {
  const statusCode = errorObj.statusCode || errorObj.status;
  const message = statusCode ? errorObj.message : 'Internal Server Error';
  send(res, statusCode || 500, DEV ? errorObj.stack : message);
  if (errorObj instanceof Error) {
    console.error(errorObj.stack);
  } else {
    console.warn('thrown error must be an instance Error');
  }
};

// Maps requests to buffered raw bodies so that
// multiple calls to `json` work as expected
// @ts-ignore
const rawBodyMap = new WeakMap();

export const parseJSON = str => {
  try {
    return JSON.parse(str);
  } catch (err) {
    throw createError(400, 'Invalid JSON', err);
  }
};

export const buffer = (req, { limit = '1mb', encoding = 'utf-8' } = {}) =>
  Promise.resolve().then(() => {
    const type = req.headers['content-type'] || 'text/plain';
    const length = req.headers['content-length'];

    const body = rawBodyMap.get(req);

    if (body) {
      return body;
    }

    return getRawBody(req, { limit, length, encoding })
      .then(buf => {
        rawBodyMap.set(req, buf);
        return buf;
      })
      .catch(err => {
        if (err.type === 'entity.too.large') {
          throw createError(413, `Body exceeded ${limit} limit`, err);
        } else {
          throw createError(400, 'Invalid body', err);
        }
      });
  });

export const text = (req, { limit = '1mb', encoding = 'utf-8' } = {}) =>
  buffer(req, { limit, encoding }).then(body => body.toString(encoding));

export const json = (req, opts = { limit: '1mb', encoding: 'utf-8' }) =>
  text(req, opts).then(body => {
    console.log('body::string', body)
    return parseJSON(body)
  });
