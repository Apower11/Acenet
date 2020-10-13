import React from 'react';
import Modal from './Modal';

const ErrorModal = props => {
    return (
        <Modal
            className="error-modal"
            onCancel={props.onClear}
            header="An Error Occurred!"
            show={!!props.error}
            footer={
            <button onClick={props.onClear} className="modal-button">
            Okay
            </button>
            }>
            <p>{props.error}</p>
        </Modal>
    )
};

export default ErrorModal;