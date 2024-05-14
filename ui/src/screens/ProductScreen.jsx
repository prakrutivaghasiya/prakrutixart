import React from 'react';
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message.jsx';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice.js';
import {toast} from 'react-toastify';
import Meta from '../components/Meta.jsx';

const ProductScreen = () => {

    const {id: productId} = useParams();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const {data: product, isLoading, error, refetch} = useGetProductDetailsQuery(productId);
    const [createReview, {isLoading: loadingReview}] = useCreateReviewMutation();

    const {userInfo} = useSelector((state) => state.auth);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty}));
        navigate('/cart');
    }

    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            await createReview({_id: productId, rating, comment}).unwrap();
            refetch();
            toast.success('Review Submitted');
            setRating(0);
            setComment('');
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    }

  return (
    <>
        <div className='my-3'>
        <Link className='btn btn-light mx-2' to='/'>
            Go Back
        </Link>
        {userInfo && 
            userInfo.isAdmin && 
                <Link className='btn btn-light mx-2' to={`/admin/products/${productId}/edit`}>
                    <FaEdit /> Edit Product
                </Link>
        }
        </div>

        {isLoading ? (
            <Loader />
        ) : error ? (
            <Message variant='danger'>
                {error?.data?.message || error?.error}
            </Message>
        ) : (
            <>
                <Meta title={product.name} description={product.description} />
                <Row>
                    <Col md={5} >
                        <Image src={product.image} alt={product.name} rounded fluid />
                    </Col>
                    <Col md={4}>
                        <ListGroup variant='flush'>
                            <ListGroupItem>
                                <h3>{product.name}</h3>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Rating value={product.rating} text={`${product.numReviews} Reviews`}/>
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Description:</strong> {product.description}
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col><strong>${product.price}</strong></Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col><strong>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong></Col>
                                    </Row>
                                </ListGroupItem>
                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty:</Col>
                                            <Col>
                                                <Form.Control
                                                    as='select'
                                                    value={qty}
                                                    onChange={(e)=> setQty(Number(e.target.value))}
                                                >
                                                    {[...Array(product.countInStock).keys()].map((x) => (
                                                        <option key={x+1} value={x+1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                                <ListGroupItem>
                                    <Button className='btn-block'
                                        type='button'
                                        disabled={product.countInStock === 0}
                                        onClick={addToCartHandler}
                                    >
                                        Add to Cart
                                    </Button>
                                </ListGroupItem>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                <Row className='review'>
                    <Col md={6}>
                        <h2>Reviews</h2>
                        {product.reviews.length === 0 && <Message>No Reviews</Message>}
                        <ListGroup variant='flush'>
                            {product.reviews.map((review) => (
                                <ListGroup.Item key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating value={review.rating} />
                                    <p>{review.createdAt.substring(0,10)}</p>
                                    <p>{review.comment}</p>
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item>
                                <h2>Write a Customer Review</h2>
                                {loadingReview && <Loader />}
                                {
                                    userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating' className='my-2'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e) => setRating(Number(e.target.value))}
                                                >
                                                    <option value=''>Select...</option>
                                                    <option value='1'>1 - Poor</option>
                                                    <option value='2'>2 - Fair</option>
                                                    <option value='3'>3 - Good</option>
                                                    <option value='4'>4 - Very Good</option>
                                                    <option value='5'>5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId='comment'>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    row='3'
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>
                                            <Button
                                                disabled={loadingReview}
                                                type='submit'
                                                variant='primary'
                                            >Submit</Button>
                                        </Form>
                                    ) : (
                                        <Message>Please <Link to='/login'>sign in</Link> to write a review.</Message>
                                    )
                                }
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </>
        )}    
    </>
  )
}

export default ProductScreen