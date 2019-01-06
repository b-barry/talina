import { createError, HttpErrorResponse, json } from './http/micro';

export const responseJson = (res, body = {}, status = 200) => {
  const response = {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      // TODO: setup correct cors
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(body),
  };

  res.writeHead(response.statusCode, response.headers);
  res.write(response.body);
  res.end();
};
export const responseError = (
  res,
  { statusCode, message }: HttpErrorResponse
) => {
  res.writeHead(statusCode || 400, {
    'Content-Type': 'application/json',
    // TODO: setup correct cors
    'Access-Control-Allow-Origin': '*',
  });
  res.write(JSON.stringify({ statusCode, message }));
  res.end();
};

export const identity = v => v;

export const isPost = async (req: Request, bodyValidationFn = identity) => {
  if (req.method.toLowerCase() !== 'post') {
    throw createError(400, 'POST request is required');
  }
  return json(req);
};

export const isOptions = (req: Request) => {
  return req.method.toLowerCase() === 'OPTIONS'.toLowerCase();
};

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U | null, T | undefined]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }

      return [err, undefined];
    });
}
