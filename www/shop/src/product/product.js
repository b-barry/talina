import PropTypes from 'prop-types';
import React from 'react';
import {groupBy} from '../utils';
import ProductItem from './product-item';

const getProductItemsOrderBySizeAndQuantity = product => {
  const skus = product.skus.data.map(sku => {
    return sku;
  });

  const skusBySizeMap = groupBy(skus, sku => {
    return sku.attributes.size;
  });

  const orderedMapKeys = Object.keys(skusBySizeMap).sort(
    (a, b) => parseInt(a, 10) - parseInt(b, 10)
  );

  return orderedMapKeys.reduce((acc, key) => {
    return [
      ...acc,
      ...skusBySizeMap[key].sort((a, b) => {
        return parseInt(a.attributes.pack, 10) - parseInt(b.attributes.pack, 10);
      }),
    ];
  }, []);
};


const Product = ({data, addToCart}) => {
  return (
    <section className="my-8 font-sans container m-auto max-w-xl ">
      <div className="text-center">
        <h1 className="my-4 font-medium">{data.name}</h1>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap my-8">
        {getProductItemsOrderBySizeAndQuantity(data).map(item => (
          <ProductItem
            key={item.id}
            {...item}
            addToCart={() => addToCart(item)}
          />
        ))}
      </div>
    </section>
  );
};

Product.propTypes = {
  addToCart: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  caption: PropTypes.string,
  description: PropTypes.string,
  skus: PropTypes.shape({
    object: PropTypes.string,
    total_count: PropTypes.number,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        price: PropTypes.number,
        attributes: PropTypes.shape({
          size: PropTypes.string,
          pack: PropTypes.string,
        }),
        object: PropTypes.string,
        inventory: PropTypes.shape({
          quantity: PropTypes.number,
          type: PropTypes.string,
        }),
        currency: PropTypes.string,
      })
    ),
  }),
};

export default Product;
