import React from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import {FormText, Row, Col, ListGroup, Image, Card, Button} from 'react-bootstrap';
import {PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useGetOrderDetailsQuery, useGetPayPalCliendIdQuery, usePayOrderMutation, useDeliverOrderMutation, useDeleteOrderMutation } from '../slices/ordersApiSlice';
import Meta from '../components/Meta';

const OrderScreen = () => {
  const {id: orderId} = useParams();

  const navigate = useNavigate();

  const {data:order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId);

  const [deleteOrder, {isLoading: loadingDelete}] = useDeleteOrderMutation();

  const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();

  const [deliveredOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();

  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

  const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalCliendIdQuery();

  const {userInfo} = useSelector((state) => state.auth);

  useEffect(() => {
    if(!errorPayPal && !loadingPayPal && paypal.clientId){
      const loadPayPalScript = async() => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'clientId': paypal.clientId,
            currency: 'CAD',
          }
        });
        paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
      }

      if(order && !order.isPaid) {
        if(!window.paypal){
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, errorPayPal, loadingPayPal])

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({orderId, details}).unwrap();
        refetch();
        toast.success('Payment Successful');
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
      }
    });
  }

  const onError = (error) => {
    toast.error(error.message);
  }

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice,
          }
        }
      ]
    }).then((orderId) => {
      return orderId;
    });
  }

  const cancelOrderHandler = async () => {
    if(window.confirm('Are you sure you want to cancel this order? This cannot be undone')) {
      try {
          await deleteOrder(orderId);
          navigate(-1);
          toast.success('Order Cancelled');
      } catch (error) {
          toast.error(error?.data?.message || error.error);
      }
    }
  }

  const deliverHandler = async() => {
    try {
      await deliveredOrder(orderId);
      refetch();
      toast.success('Order Delivered');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }

  const backHandler = () => {
    navigate(-1);
  }

  return (
    <>
      <Meta title="Order Details - ArtShop" description="Update your order info here" />
      {isLoading ? 
        <Loader /> : 
          error ? 
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message> 
          : (
        <>
          <Button 
                type='button'
                className='btn btn-light my-2'
                onClick={backHandler}
            >
                Go Back
          </Button>
          <h3>Order Id: {order._id}</h3>
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong>
                    {order.user.name}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    {order.user.email}
                  </p>
                  <p>
                    <strong>Address: </strong>
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </p>
                  {order.isDelivered ? (
                    <Message variant='success'>
                      Delivered on {order.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant='danger'>Not Delivered</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <Message variant='success'>
                      Paid at {order.paidAt}
                    </Message>
                  ) : (
                    <Message variant='danger'>Not Payed</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`} style={{textDecoration: 'none'}}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${order.itemsPrice}</Col>
                    </Row>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${order.shippingPrice}</Col>
                    </Row>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${order.taxPrice}</Col>
                    </Row>
                    <Row>
                      <Col>Total</Col>
                      <Col>${order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  {
                    !order.isPaid && (
                      <>
                        <ListGroup.Item>
                          {loadingPay && <Loader />}
                          {isPending ? <Loader /> : (
                              <div>
                                <PayPalButtons
                                  createOrder={createOrder}
                                  onApprove={onApprove}
                                  onError={onError}
                                ></PayPalButtons>
                              </div>
                          )}
                        </ListGroup.Item>
                        {userInfo && order.user && order.user._id === userInfo._id && 
                          <ListGroup.Item>
                            <Button
                              type='button'
                              className='btn btn-block'
                              onClick={cancelOrderHandler}
                            >
                              Cancel Order
                            </Button>
                          </ListGroup.Item>
                        }
                    </>
                    )
                  }
                  {
                    order.isPaid && !order.isDelivered && (
                      <FormText muted className='mx-3'>To cancel order please contact <a href='mailto: prakrutixart@gmail.com' style={{textDecoration: 'none'}}>prakrutiXart</a> by email.</FormText>
                    )
                  }
                  {loadingDeliver && <Loader />}
                  {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <ListGroup.Item>
                      <Button 
                        type='button' 
                        className='btn btn-block'
                        onClick={deliverHandler}
                      >
                        Mark as Delivered
                      </Button>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )
    }
  </>
)};

export default OrderScreen;