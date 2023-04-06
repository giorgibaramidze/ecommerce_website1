import Header from './components/Header'
import Footer from './components/Footer'
import {Container} from 'react-bootstrap'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import {Routes, Route, HashRouter as Router} from 'react-router-dom'
import ProductPage from './pages/ProductPage'
import LoginPage from './pages/LoginPage'
import CartPage from './pages/CartPage'
import ShippingPage from './pages/ShippingPage'
import PlaceOrderPage from './pages/PlaceOrderPage'
import OrderPage from './pages/OrderPage'
import OrderListPage from './pages/OrderListPage'
import AllProductPage from './pages/AllProductsPage'
import SearchResult from './pages/SearchResult'

const App = () =>{
  return (
    <Router>
      <Header/>
      <main className='py-5'>
        <Container style={{minHeight:'600px'}}>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/product/:productID' element={<ProductPage/>}/>
            <Route path='/register' element={<RegisterPage/>}/>
            <Route path='/products' element={<AllProductPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/profile' element={<ProfilePage/>}/>
            <Route path='/cart' element={<CartPage/>}/>
            <Route path='/shipping' element={<ShippingPage/>}/>
            <Route path='/placeorder' element={<PlaceOrderPage/>}/>
            <Route path='/orders' element={<OrderListPage/>}/>
            <Route path='/order/:orderID' element={<OrderPage/>}/>
          </Routes>
        </Container>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;