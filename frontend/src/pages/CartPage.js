import {useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Row, Col, ListGroup, Image, Form, Button, Card, Alert} from 'react-bootstrap'
import Loader from '../components/Loader'
import {getCart, deleteCartItem, resetItems, addCartItem } from '../features/cart/cartSlice'
import ShopModal from '../components/Modal'
import { openModal, closeModal } from '../features/modalSlice'
import { clearOrder } from '../features/orderSlice'


const CartPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const cart = useSelector(state => state.cart)
    const {cartItems, error, loading, success} = cart
    const auth = useSelector(state => state.auth)
    const {isOpen} = useSelector(state => state.modal)
    const checkoutHandler = () => {
        navigate('/shipping')
    }

    const deleteItem = (id) => {
        dispatch(deleteCartItem(id))
        dispatch(closeModal())
        dispatch(resetItems())
    }

    useEffect(()=> {
        dispatch(getCart(auth))
        dispatch(resetItems())
        dispatch(clearOrder())
    }, [dispatch, auth, success])
    console.log(cartItems)

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                { loading ? <Loader/>
                    :cartItems.items && cartItems.items.length === 0 ? (
                        <Alert variant='info'>
                            Your cart is empty <Link to='/'>Go Back</Link>
                        </Alert>
                ): (
                    <ListGroup>
                        {cartItems.items && cartItems.items.map(item => (
                            <ListGroup.Item key={item.id} className='mt-2'>
                                <Row>
                                    <Col md={3}>
                                        <Image src={item.product.image} alt={item.product.name} fluid rounded/>
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                        {item.product.price}$
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control
                                            style={{width: 'auto'}}
                                            as='select'
                                            value={item.quantity}
                                            onChange={(e)=>dispatch(addCartItem({cart_id: cartItems.id, product_id: item.product.id, quantity: e.target.value} ))}
                                            >
                                            {
                                                [...Array(item.product.countInStock).keys()].map((value)=> (
                                                    <option key={value + 1} value={value + 1}>
                                                        {value + 1}
                                                    </option>
                                                ))
                                            }
                                        </Form.Control>
                                    </Col>
                                    <Col md={1}>
                                        <Button
                                            className='mr-0'
                                            type='button'
                                            variant='light'
                                            onClick={() => dispatch(openModal())}
                                            >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                       {isOpen && <ShopModal
                                                    show={isOpen} 
                                                    onClose={()=> dispatch(closeModal())}
                                                    onRemove={()=>deleteItem(item.id)}
                                                    />}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col sm={4}>
                <Card>
                    <ListGroup variant='flush' className='p-3'>
                        <ListGroup.Item>
                            <h2>Subtotal ({cartItems.items && cartItems.items.reduce((acc, item)=> acc + item.quantity, 0)}) items</h2>
                            {cartItems.items && cartItems.total}$
                        </ListGroup.Item>
                    </ListGroup>
                    <ListGroup.Item className='p-3'>
                        <Button 
                            style={{width: '100%'}}
                            type='button'
                            className='btn-block'
                            disabled={cartItems.items && cartItems.items.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed To Checkout
                        </Button>
                    </ListGroup.Item>
                </Card>
            </Col>
        </Row>
    )
}

export default CartPage
