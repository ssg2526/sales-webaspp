import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Form } from "react-bootstrap";
import {settle} from '../utils/billingUtils'

function SettleModalContent(props) {
    const [modeOfPay, setModeOfPay] = useState("CASH");

    function handlePaymentModeRadioChange(e){
        setModeOfPay(e.target.value);
    }

    async function handleSettleBill(){
        let settleBillRes = await settle(props.table, modeOfPay);
        props.close();
        props.reload();
    }

    return(
        <Modal show={props.show} onHide={props.close}>
            <Modal.Header closeButton>
                <Modal.Title>Settle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <h4>Amount: {props.table.orderValue}</h4>
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