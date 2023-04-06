import {Row, Col, Alert} from 'react-bootstrap'
import {useEffect} from 'react'
import Product from '../components/Product'
import Loader from '../components/Loader'
import {useDispatch, useSelector} from 'react-redux'
import { getProducts, removeSelectedProduct, resetAll } from '../features/product/productSlice'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import {Link, useLocation} from 'react-router-dom'

const AllProductPage = () => {
    const dispatch = useDispatch()
    const {allProduct: products, loading, error} = useSelector(state => state.products)
    useEffect(()=> {
        dispatch(getProducts())
    }, [dispatch])
    return (
        loading ? <Loader/>
            : error ? <Alert variant='danger'>{error}</Alert>
            :<Row>
                {products.map(product => (   
                    <Col sm={12} md={6} lg={4} xl={3} key={product.id}>
                        <Product product={product}/>
                    </Col>
                ))}
            </Row>
    )
}

export default AllProductPage