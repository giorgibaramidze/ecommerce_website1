import { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { searchProduct } from '../features/product/productSlice'
import { useNavigate, useLocation } from 'react-router-dom'


const SearchBox = () => {
    const dispatch = useDispatch()
    const [word, setWord] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const location = useLocation()
    const {autoCompleteResult} = useSelector(state=>state.products)
    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()
        if (word){
            navigate(`/?search=${word}`)
            setWord('')
        }
    }
    const onChangeHandler = (text) => {
        if (text.length > 0){
            dispatch(searchProduct(text))
            setWord(text)
        }else{
            setWord('')
        }
    }
    return (
        <form className="d-flex w-100 h-25 shadow-none rounded" onSubmit={submitHandler}>
            <input className="form-control me-2 rounded border-0"
                type="text" 
                name='q'
                value={word}
                onClick={(e) =>setWord(e.target.value)}
                onFocus={()=>setShowSearch(true)}
                onBlur={()=> setTimeout(() => setShowSearch(false), 120)}
                autoComplete='off'
                placeholder="Search" 
                aria-label="Search" 
                onChange={(e) => onChangeHandler(e.target.value)}/>
                {showSearch && (word && <div className='auto-complete'>
                    {(autoCompleteResult && autoCompleteResult.length) > 0 ? autoCompleteResult.map((item, index)=>(
                            <Link to={`/product/${item.id}`} key={index} className='d-flex w-100 border border-primary zoom max-height' style={{transform: 'none'}}>
                                <div className='col-md-2'>
                                    <img src={item.image} className='img-fluid img-thumbnail max-img-height w-100'/>
                                </div>
                                <div className='col text-center align-middle h6'>{item.name}</div>
                            </Link>
                        )):
                        <div className='w-100 h-100 border border-primary'>
                            <div className='mt-2 h6 w-100 p-2'>No result...</div>
                        </div>
                        }
                </div>)}               
            <button 
                disabled={autoCompleteResult.length===0 || word.length===0}
                className="btn btn-light rounded"
                type="submit">
                    Search
            </button>
        </form>
    )
}

export default SearchBox