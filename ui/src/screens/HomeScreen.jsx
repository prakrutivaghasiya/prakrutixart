import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
    const {pageNumber, keyword} = useParams();
    const {data, isLoading, error} = useGetProductsQuery({keyword, pageNumber});

  return (
    <>
        {!keyword 
            ? <ProductCarousel /> 
            : <Link to='/' className='btn btn-light my-2'>Go Back</Link>
        }
        {isLoading ? (
            <Loader />
        ) : error ? (
            <Message variant='danger'>
                {error?.data?.message || error?.error}
            </Message>
        ) : (<>
            <h1>Latest ArtWorks</h1>
            <Row>
                {data.products.length > 0 ? (
                    data.products.map((product) => (
                        <Col key={product._id} xs={12} sm={6} md={8} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    ))
                ) : (
                    <p>No results found for "{keyword}"... Try seaching for something else...</p>
                )
                }
            </Row>
            <Paginate pages={data.pages} page={data.page} keyword = {keyword ? keyword : ''} />
        </>)
        }   
    </>
  )
}

export default HomeScreen