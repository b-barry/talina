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


