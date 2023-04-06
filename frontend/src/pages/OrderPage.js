import { useEffect, useState } from "react";
import {Row, Col, ListGroup, Image, Card, Alert} from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { Link, useParams } from "react-router-dom";
import { getOrderDetails, payOrder, clearOrder  } from "../features/orderSlice";
import { useNavigate } from 'react-router-dom'
import {PayPalScriptProvider, PayPalButtons} from '@paypal/react-paypal-js'

const OrderPage = () => {
    const {order, loading} = useSelector(state=>state.order)

    const {orderID} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getOrderDetails(orderID))
        dispatch(clearOrder())
    }, [dispatch, orderID])

    

    return (
            loading ? <Loader/>:order.order_items && (
                <PayPalScriptProvider options={{'client-id': 'AQ2kuNnw7XlLJFUtEyB4qn622ySF9DjY_hZ9AYtesgFOXJFkR5tnxtV9P9JU3kdd0DNPCu2CqgdWrrVk'}}>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>Shipping</h2>
                                    <p><strong>Name: </strong> {order.user.name}</p>
                                    <p><strong>Email: </strong> {order.user.email}</p>
                                    <p>
                                        <strong>Shipping: </strong>
                                        {order.shipping_address.address}, {order.shipping_address.city}
                                        {' '}
                                        {order.shipping_address.postalCode},
                                        {' '}
                                        {order.shipping_address.country}
                                    </p>
                                    {order.isDelivered ? (
                                        <Alert variant='success'>Delivered on {order.deliveredAt.substring(0, 10)}</Alert>
                                    ) : (
                                        <Alert variant='warning'>Not Delivered</Alert>
                                    )}

                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h2>Payment Method</h2>
                                    <p>
                                        <strong>Method: </strong>
                                        {order.paymentMethod}
                                    </p>
                                    {order.isPaid ? (
                                        <Alert variant='success'>Paid on {order.paidAt.substring(0, 10)}</Alert>
                                    ) : (
                                        <Alert variant='warning'>Not Paid</Alert>
                                    )}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h2>Order Items</h2>
                                    {order.order_items.length === 0 ? <Alert variant="info">
                                        Your cart is empty
                                    </Alert> :(
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col md={8}>
                                                    Product
                                                </Col>
                                                <Col md={2}>
                                                    Quantity
                                                </Col>
                                                <Col md={2}>
                                                    Total Price
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    {order.order_items.map(item =>(
                                        <ListGroup.Item key={item.id}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                                </Col>
                                                <Col md={7}>
                                                    <Link to={`/product/${item.product.id}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={2}>
                                                    <span>{item.qty}</span>
                                                </Col>
                                                <Col md={2}>
                                                    <span>{(item.qty * Number(item.price)).toFixed(2)}$</span>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
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
                                    <Col>Items: </Col>
                                    <Col>{(order.order_items && order.order_items.reduce((acc, item)=>acc + item.qty * Number(item.price), 0).toFixed(2))}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping: </Col>
                                    <Col>{order.shippingPrice}$</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax: </Col>
                                    <Col>{order.taxPrice}$</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total: </Col>
                                    <Col>{order.totalPrice}$</Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loading && <Loader/>}
                                    <PayPalButtons 
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                               purchase_units: [
                                                {
                                                    amount: {value:order.totalPrice}
                                                }
                                               ] 
                                            })
                                        }}
                                        onApprove={(data, actions)=>{
                                            const orderss = actions.order.capture().then(result=>{
                                                dispatch(payOrder({orderID, result}))
                                            })
                                            
                                        }}/>
                                   
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </PayPalScriptProvider>
    ))
}

export default OrderPage