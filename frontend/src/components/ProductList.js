import {Row, Col, Alert} from 'react-bootstrap'
import {useEffect} from 'react'
import Product from '../components/Product'
import Loader from '../components/Loader'
import {useDispatch, useSelector} from 'react-redux'
import { getProducts, removeSelectedProduct } from '../features/product/productSlice'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import {Link, useLocation} from 'react-router-dom'

const ProductList = ({ordering}) =>{
    const dispatch = useDispatch()
    const {products, loading, error} = useSelector(state => state.products)
    const location = useLocation()

    useEffect(()=> {
        dispatch(getProducts(ordering))
    }, [dispatch, location.search])
    return (
            <section style={{minHeight: '532px'}}>
                    {loading ? <Loader/>
                        : error ? <Alert variant='danger'>{error}</Alert>
                            :
                            <>
                            <Row> <Col><h2>Top Review Products</h2></Col></Row>
                            <Swiper
                                slidesPerView={4}
                                spaceBetween={15}
                                modules={[Navigation, Pagination, Scrollbar, A11y]}
                                navigation={true}
                                breakpoints={{
                                    0: {
                                    // width: 576,
                                        slidesPerView: 1,
                                    },
                                    768: {
                                    // width: 768,
                                        slidesPerView: 2,
                                    },
                                    1124: {
                                        // width: 768,
                                        slidesPerView: 4,
                                    },
                                }}
                            > 
                                {products.newProduct && products.rating.map(product => (
                                        <SwiperSlide key={product.id}>
                                            <Product product={product}/>
                                        </SwiperSlide>
                                    ))}
                            <Row>
                                <Col><h2>Latest Products</h2></Col>
                                <Col className='d-flex justify-content-end'><Link to={'/products'} className='text-success h4'>View All Product</Link></Col>
                            </Row>
                            <Row>
                                    {products.newProduct && products.newProduct.map(product => (  
                                        <Col sm={12} md={6} lg={4} xl={3} key={product.id}>
                                            <Product product={product}/>
                                        </Col>
                                    ))}
                                </Row>
                        </Swiper>
                        </>
                    }
            </section>
    )
}
export default ProductList
// (location.search.length 