import Rating from './Rating'
import {Link} from 'react-router-dom'

const Product = ({product}) => {
    return (
        <Link to={`/product/${product.id}`}>
            <div className='card my-3 rounded shadow border-0 zoom'>
                <img className='card-img rounded' src={product.image} style={{height: '250px'}}/>
                <div className='card-body'>
                    <div className='card-title text-center' style={{height: '50px'}}>
                        <strong>{product.name}</strong>
                    </div>
                    <h3 className='card-text text-center'>
                        ${product.price}
                    </h3>
                    <div className='card-text'>
                        <div className='my-3'>
                            <Rating value={product.rating} color={'#f8e825'}/>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Product