import {Container, Row, Navbar, Nav, NavDropdown} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../features/user/authSlice'
const Header = () => {
    const userLogin = useSelector(state=>state.auth)
    const {userInfo} = userLogin

    const dispatch = useDispatch()

    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <header>
            <div className='container'>
                <nav className="navbar navbar-expand-lg navbar-light border-0">
                    <div className="container-fluid">
                        <Link to='/'>
                            <Navbar.Brand>OnlineShop</Navbar.Brand>
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarScroll">
                            <SearchBox/>
                            <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll w-100 justify-content-end">
                            {userInfo ? (
                                <li className="nav-item dropdown ">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {userInfo.name}
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
                                        <li>
                                            <Link to='/cart'>
                                                <div className='dropdown-item'>Cart</div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to='/orders'>
                                                <div className='dropdown-item'>Orders</div>
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider"/></li>
                                        <li style={{cursor: 'pointer'}}>
                                            <a onClick={logoutHandler} className='cursor-pointer dropdown-item'>Logout</a>
                                        </li>
                                    </ul>
                                </li>
                                ):
                                <li className="nav-item">
                                    <LinkContainer to='/login'>
                                        <Nav.Link><i className='fas fa-user'>Login</i></Nav.Link>
                                    </LinkContainer>
                                </li>
                                }
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header