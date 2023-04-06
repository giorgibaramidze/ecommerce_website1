import { useEffect, useState } from "react";
import {Button, Row, Col, ListGroup, Image, Card, Alert} from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux";
import {getCart } from '../features/cart/cartSlice'
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { addOrder, clearOrder } from "../features/orderSlice";
import { useNavigate } from 'react-router-dom'

const PlaceOrderPage = () => {
    const {shippingAddress} = useSelector(state=> state.auth)
    const {cartItems, loading} = useSelector(state=>state.cart)
    const {order, success, error} = useSelector(state=>state.order)

    const navigate = useNavigate()
    const taxPrice = (Number(cartItems.total) * Number(0.082)).toFixed(2)
    const shippingPrice = cartItems.total > 100 ? 0 : 10
    const totalPrice = Number(shippingPrice) + Number(taxPrice) + Number(cartItems.total)
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const placeOrder = () => {
        dispatch(addOrder({
            orderItems: cartItems.items,
            paymentMethod: 'paypal',
            shippingAddress:shippingAddress,
            itemsPrice: cartItems.total,
            shippingPrice: shippingPrice,
            taxPrice: Number(taxPrice),
            totalPrice:totalPrice,
        }))
        
    }


    useEffect(()=>{
        dispatch(getCart(auth))
    }, [dispatch])


    useEffect(()=>{
        if(success){
            navigate(`/order/${order.id}`)
        }
    }, [success, navigate])
    return (
            loading ? <Loader/>:cartItems.items && shippingAddress && (
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                    <p>
                                        <strong>Shipping: </strong>
                                        {shippingAddress.address}, {shippingAddress.city}
                                        {' '}
                                        {shippingAddress.postalCode},
                                        {' '}
                                        {shippingAddress.country}
                                    </p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {cartItems.length === 0 ? <Alert variant="info">
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
                                {cartItems.items.map(item =>(
                                    <ListGroup.Item key={item.product.id}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.product.image} alt={item.product.name} fluid rounded/>
                                            </Col>
                                            <Col md={7}>
                                                <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                                            </Col>
                                            <Col md={2}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={2}>
                                                <span>{item.sub_total}$</span>
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
                                <Col>{cartItems.total.toFixed(2)}$</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping: </Col>
                                <Col>{shippingPrice}$</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Tax: </Col>
                                <Col>{taxPrice}$</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total: </Col>
                                <Col>{totalPrice.toFixed(2)}$</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block w-100'
                                disabled={cartItems.items.length === 0}
                                onClick={placeOrder}
                            >
                                Place Order
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    ))
}

export default PlaceOrderPage