import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Form } from "react-bootstrap";
import {updateSeatingData, settleBill, settle} from '../utils/billingUtils'

function SettleModalContent({show, table, reload}) {
    console.log("hahahhahahah");
    console.log(show);
    const [modeOfPay, setModeOfPay] = useState("CASH");
    const [showModal, setShowModal] = useState(show);
    console.log("show modal: "+ showModal);
    function handlePaymentModeRadioChange(e){
        setModeOfPay(e.target.value);
    }

    function handleCloseModal(){
        setShowModal(false);
    }

    // function handleShow(){
    //     setShowModal(true);
    // }

    async function handleSettleBill(){
        console.log(table)
        let settleBillRes = await settle(table, modeOfPay);
        setShowModal(false);
        reload();
    }

    return(
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Settle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <h4>Amount: {table.orderValue}</h4>
                    <form>
                        <Form.Group controlId="paymentType">
                            <Form.Check
                            value="CASH"
                            type="radio"
                            aria-label="radio 1"
                            label="Cash"
                            onChange={handlePaymentModeRadioChange}
                            checked={modeOfPay === "CASH"}
                            />
                            <Form.Check
                            value="ONLINE"
                            type="radio"
                            aria-label="radio 2"
                            label="Online"
                            onChange={handlePaymentModeRadioChange}
                            checked={modeOfPay === "ONLINE"}
                            />
                        </Form.Group>
                    </form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='button-div'>
                    <Button onClick={(e)=>handleSettleBill()}>Settle</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default SettleModalContent;