export const responseJson = (res, body = {}, status = 200) => {
  const response = {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      // TODO: setup correct cors
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body),
  };

  res.writeHead(response.statusCode, response.headers);
  res.write(response.body);
  res.end();
};


/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error> (
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

