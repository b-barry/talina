const stripe = require('stripe')('sk_test_ukSDWNgMFuozbc28RKv1PLhQ');

module.exports = async (req, res) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: "cart4"
    }),
  };
  res.writeHead(response.statusCode, response.headers);
  res.write(response.body);
  res.end();
};
