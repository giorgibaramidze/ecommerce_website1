import {Row, Col, ListGroup, Image, Form, Button, Card,Table, Alert} from 'react-bootstrap'
import { getOrderlist, clearOrder } from '../features/orderSlice'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import Loader from '../components/Loader'

const OrderListPage = () => {
    const {loading, error, orderList} = useSelector(state=>state.order)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getOrderlist())
    }, [dispatch])
    return (
        loading ? <Loader/> : (
            <Row>
                <Col>
                    <h2>My Orders</h2>
                
                    {error ? <Alert variant='danger'>{error}</Alert> :  (
                        <Table striped responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Delivered</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderList.map(order=>(
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>${order.totalPrice}</td>
                                        <td>{order.isPaid ? order.paidAt.substring(0, 10) : (
                                            <i className='fas fa-times' style={{color: 'red'}}></i>
                                        )}</td>
                                        <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (
                                            <i className='fas fa-times' style={{color: 'red'}}></i>
                                        )}</td>
                                        <td>
                                            <Link to={`/order/${order.id}`}>
                                                <Button className='btn-sm'>Details</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        )
    )
}

export default OrderListPage