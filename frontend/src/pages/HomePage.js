import {Row, Col, Alert} from 'react-bootstrap'
import {useEffect} from 'react'
import Product from '../components/Product'
import Loader from '../components/Loader'
import {useDispatch, useSelector} from 'react-redux'
import { getProducts } from '../features/product/productSlice'
import ProductList from '../components/ProductList'
import { useLocation } from 'react-router-dom'
import SearchResult from './SearchResult'

const HomePage = () =>{
    const location = useLocation()
    return (
        <>        
            {location.search ? <SearchResult ordering={location.search}/>:(
                    <ProductList ordering={'?home=product'}/>
            )}  
        </>
    )
}

export default HomePage