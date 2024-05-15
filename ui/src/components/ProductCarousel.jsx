import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {

    const {data: products, isLoading, error} = useGetTopProductsQuery();

  return isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
    <Carousel pause='hover' className='bg-primary mb-4' style={{minHeight: '200px'}}>
        {products.map((product) => (
            <Carousel.Item key={product._id}>
                <Link to={`/product/${product._id}`}>
                    <Image src={product.image} alt={product.name} fluid style={{ minHeight: '200px', height: '25vw', width: 'auto', objectFit: 'cover'}}/>
                    <Carousel.Caption className='carousel-caption'>
                        <h5>{product.name} (${product.price})</h5>
                    </Carousel.Caption>
                </Link>
            </Carousel.Item>
        ))}
    </Carousel>
  )
}

export default ProductCarousel