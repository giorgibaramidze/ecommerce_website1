import {Row, Col, Alert} from 'react-bootstrap'
import {useEffect} from 'react'
import Product from '../components/Product'
import Loader from '../components/Loader'
import {useDispatch, useSelector} from 'react-redux'
import { getProducts, removeSelectedProduct } from '../features/product/productSlice'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import {Link, useLocation} from 'react-router-dom'

const SearchResult = ({ordering}) =>{
    const dispatch = useDispatch()
    const {products, loading, error, searchResult} = useSelector(state => state.products)
    const location = useLocation()
    console.log(ordering)

    useEffect(()=> {
        dispatch(getProducts(ordering))
    }, [dispatch, location.search])
    return (
            <section style={{minHeight: '532px'}}>
                    {loading ? <Loader/>
                        : error ? <Alert variant='danger'>{error}</Alert>
                            :
                            <Row>
                                    {searchResult.map(product => (  
                                        <Col sm={12} md={6} lg={4} xl={3} key={product.id}>
                                            <Product product={product}/>
                                        </Col>
                                    ))}
                                </Row>}
            </section>
    )
}
export default SearchResult
// (location.search.length 