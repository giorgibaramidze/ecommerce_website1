import {Modal, Button} from 'react-bootstrap'

const ShopModal = ({show, onClose, onRemove})=> {
  return (
    <Modal
      show={show}
      onHide={onClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
            <h4>
                are you sure?
            </h4>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-between'>
            <Button className='bg-info' onClick={onClose}>Cancel</Button>
            <Button className='bg-danger' onClick={onRemove}>Delete</Button>
        </Modal.Footer>
    </Modal>
  );
}

export default ShopModal