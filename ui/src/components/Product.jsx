import React from 'react';
import {Card} from 'react-bootstrap';
import Rating from './Rating';
import {Link} from 'react-router-dom';

const Product = ({product}) => {
  return (
    <Card className="my-3 p-3 rounded">
      <div className='rounded' style= {{height:'15vw', width: '100%'}}>
        <Link to={`/product/${product._id}`}>
            <Card.Img src={product.image} variant="top" style={{height:'15vw' , width: '100%', objectFit: 'scale-down'}}/>
        </Link>
      </div>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
            <Card.Title as='div' className='product-tile'>
                <strong>{product.name}</strong>
            </Card.Title>
        </Link> 
        <Card.Text as="div">
          <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text> 
        </Card.Body>
    </Card>
  )
}

export default Product