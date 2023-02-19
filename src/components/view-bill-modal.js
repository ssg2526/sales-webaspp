import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import MyTable from '../components/table';
import { doBill} from '../utils/billingUtils'
import { addCustomer } from '../utils/customerUtils';

function ViewBillModalContent({show, table, kots, reload}){
    const [showModal, setShowModal] = useState(show);
    const [kotTableData, setTableData] = useState([]);
    const { menuItems} = useContext(AppContext)
    const [customerContact, setCustomerContact] = useState(""); 
    const [customerName, setCustomerName] = useState(""); 
    const [customerDob, setCustomerDob] = useState("");

    const columns = [
        {title: "Item", field: 'name'},
        {title: "Rate", field: 'rate'},
        {title: "Qty", field: 'qty'},
        {title: "Amount", field: 'amount'},
    ];

    useEffect(()=>{
        console.log("bill button clicked")
        let itemSummary = [];
        let uniqueItems = {};
        kots.forEach((kot)=>{
            kot["kotItems"].forEach((kotItem)=>{
                menuItems.forEach((item)=>{
                    if(kotItem.itemId === item.id){
                        console.log(item);
                        kotItem["name"] = item.name;
                    }
                });
                kotItem["amount"] = kotItem["sellingPrice"];
                if(uniqueItems[kotItem.itemId]){
                    uniqueItems[kotItem.itemId]["qty"] += kotItem["qty"];
                    uniqueItems[kotItem.itemId]["sellingPrice"] += kotItem["sellingPrice"];
                    uniqueItems[kotItem.itemId]["amount"] += kotItem["amount"];
                } else {
                    uniqueItems[kotItem.itemId] = kotItem;
                }
            });
        });

        Object.keys(uniqueItems).forEach((itemId)=>{
            itemSummary.push(uniqueItems[itemId]);
        });
        setTableData(itemSummary);
    },[]);

    function handleCloseModal(){
        setShowModal(false);
    }

    // function handleShow(){
    //     setShowModal(true);
    // }

    function handleCustomerName(e){
        setCustomerName(e.target.value)
    }

    function handleCustomerContact(e){
        setCustomerContact(e.target.value)
    }

    function handleCustomerDob(e){
        setCustomerDob(e.target.value);
    }

    async function handlePrintBill(){
        console.log(table)
        let customerDetails = {
            "name": customerName,
            "contact": customerContact,
            "dob": customerDob
        }
        console.log(customerDetails)
        if(customerContact){
            addCustomer(customerDetails);
        }
        let invoice_resp = await doBill(kotTableData, table.id, customerDetails);
        table = invoice_resp.data;
        setShowModal(false);
        reload();
    }

    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Bill Summary</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <form>
                        <input onChange={(e)=>handleCustomerName(e)} id="name" value={customerName} placeholder='Name' type="text" />
                        <input onChange={(e)=>handleCustomerContact(e)} id="contact" value={customerContact} placeholder='Contact' type="text" />
                        <input onChange={(e)=>handleCustomerDob(e)} id="dob" value={customerDob} placeholder='Dob' type="date" />
                        {/* <button>Search</button> */}
                    </form>
                    <div>
                        <MyTable data={kotTableData} columns={columns}/>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='button-div'>
                    <Button onClick={(e)=>handlePrintBill()}>Print Bill</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ViewBillModalContent;