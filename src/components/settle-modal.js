import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Form, Row, Col } from 'react-bootstrap';
import {settle} from '../utils/billingUtils'

function SettleModalContent(props) {
    const [modeOfPay, setModeOfPay] = useState("CASH");
    const [onlineComponent, setOnlineComponent] = useState();
    const [cashComponent, setCashComponent] = useState();

    function handlePaymentModeRadioChange(e){
        setModeOfPay(e.target.value);
    }

    async function handleSettleBill(){
        document.getElementById("settle-bill").disabled = true;
        let settlementDetails = []
        if(cashComponent > props.table.orderValue){
            alert("Zada Hoshiyar Ho kya???");
        } else {
            if(modeOfPay === "SPLIT"){
                settlementDetails.push({
                    "paymentMode": "CASH",
                    "amount": cashComponent - 0
                });
                settlementDetails.push({
                    "paymentMode": "ONLINE",
                    "amount": props.table.orderValue - cashComponent
                });
            } else {
                settlementDetails.push(
                    {
                        "paymentMode": modeOfPay,
                        "amount": props.table.orderValue
                    }
                );
            }
            await settle(props.table, settlementDetails);
        }
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
                            <Form.Check
                            value="SPLIT"
                            type="radio"
                            aria-label="radio 3"
                            label="Split"
                            onChange={handlePaymentModeRadioChange}
                            checked={modeOfPay === "SPLIT"}
                            />
                        </Form.Group>
                        {(modeOfPay === "SPLIT")?
                            (<Row className="mb-3">
                            <Form.Group as={Col} controlId="cash" className="mb-3">
                            <Form.Label>Cash*</Form.Label>
                                <Form.Control
                                type="number"
                                value={cashComponent}
                                onChange={(event) => setCashComponent(event.target.value)}
                                required
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="online" className="mb-3">
                                <Form.Label>Online*</Form.Label>
                                <Form.Control
                                type="number"
                                disabled='true'
                                value={props.table.orderValue - cashComponent}
                                required
                                />
                            </Form.Group>
                        </Row>
                        ):<div></div>
                        }
                    </form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='button-div'>
                    <Button id="settle-bill" onClick={(e)=>handleSettleBill()}>Settle</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default SettleModalContent;