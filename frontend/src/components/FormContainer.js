import {Col} from 'react-bootstrap'

const FormContainer = ({children}) => {
    return (
        <div className='container'>
            <div className='row justify-content-md-center'>
                <Col xs={12} md={6}>
                    {children}
                </Col>
            </div>
        </div>
    )
}

export default FormContainer