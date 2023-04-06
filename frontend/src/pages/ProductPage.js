import {Link, useParams, useNavigate} from 'react-router-dom' 
import { Row, Col, Image, ListGroup, Button, Alert, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import {useState, useEffect} from 'react'
import Loader from '../components/Loader'
import {useDispatch, useSelector} from 'react-redux'
import { getProductDetails, createProductReview, removeSelectedProduct } from '../features/product/productSlice'
import { addCartItem, getCart, resetItems } from '../features/cart/cartSlice'

const ProductPage = () => {
    const [quantity, setQuantity] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const {productID} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cart = useSelector(state => state.cart)
    const {cartItems, success} = cart
    const auth = useSelector(state=>state.auth)
    const {userInfo} = auth

    const {productDetails: product, loading, error, reviewSuccess, reviewLoading, reviewError} = useSelector(state => state.products)
    useEffect(()=> {
        dispatch(getProductDetails(productID))
        dispatch(removeSelectedProduct())
        if (auth){
            dispatch(getCart(auth))
        }
    }, [dispatch, productID])

    useEffect(()=>{
        if(success){
            dispatch(resetItems())
            navigate('/cart')
        }else if (reviewSuccess) {
            setRating(0)
            setComment('')
        }
    }, [success, reviewSuccess])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview({productID, rating, comment}))
        dispatch(removeSelectedProduct())
    }

    const addToCart = () => {
        dispatch(addCartItem({cart_id: cartItems.id, product_id: productID, quantity}))
    }

    return (
        loading ? <Loader/>
        : error ? <Alert variant='danger'>{error}</Alert>
        :
        (<div>
            <Link to='/' className='btn btn-ligth my-3'>Go Back</Link>  
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.image} fluid/>
                        </Col>

                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item className='py-3'>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'}/>
                                </ListGroup.Item>

                                <ListGroup.Item className='py-3'>
                                    Price: ${product.price}
                                </ListGroup.Item>
                                <ListGroup.Item className='py-3'>
                                    Description {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <ListGroup>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>
                                            <strong>${product.price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.countInStock > 0 ? 'In Stock' : 'Out of stock'}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>qty</Col>
                                            <Col xs='auto' className='my-1'>
                                                <Form.Control
                                                    as='select'
                                                    value={quantity}
                                                    onChange={(e)=> setQuantity(e.target.value)}>
                                                    {
                                                        [...Array(product.countInStock).keys()].map((value)=> (
                                                            <option key={value + 1} value={value + 1}>
                                                                {value + 1}
                                                            </option>
                                                        ))
                                                    }
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                                <ListGroup.Item>
                                    <Button  className='btn-block' onClick={addToCart} disabled={product.countInStock == 0} type='button' style={{width:'100%'}}>Add to Cart</Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <h4>Reviews</h4>
                            {product.reviews && product.reviews.length === 0 && <Alert variant='info'>No Reviews</Alert>}
                            <ListGroup>
                                {product.reviews && product.reviews.map(review => (
                                    <ListGroup.Item key={review.id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} color='#f8e825'/>
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}

                                <ListGroup.Item>
                                    <h4>Write a review</h4>
                                    {reviewLoading && <Loader/>}
                                    {reviewSuccess && <Alert variant='success'>Review Submitted</Alert>}
                                    {reviewError && <Alert variant='danger'>{reviewError}</Alert>}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
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
                                                <Form.Label>Review</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    row='5'
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>

                                            <Button
                                                disabled={reviewLoading}
                                                type='submit'
                                                variant='primary'
                                            >
                                                Submit
                                            </Button>

                                        </Form>
                                    ) : (
                                        <Alert variant='info'>Please <Link to='/login'>login to write a review</Link></Alert>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </div>
            )
        )
}

export default ProductPage