const stripe = require('stripe')('sk_test_ukSDWNgMFuozbc28RKv1PLhQ');

module.exports = async (req, res) => {
    try {
        var products = await stripe.products.list({
            limit: 10
        });
        for (var product of products.data) {
            const skus = await stripe.skus.list({
                limit: 5
            })
            product.skus = skus.data;
        }
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: products.data
            }),
        };
        res.writeHead(response.statusCode, response.headers);
        res.write(response.body);
        res.end();
    } catch (err) {
        const response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: err.message,
            }),
        };
        res.writeHead(response.statusCode, response.headers);
        res.write(response.body);
        res.end();
    };
};