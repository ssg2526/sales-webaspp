import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../context';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import MyTable from '../components/table';
import { doBill} from '../utils/billingUtils'
import { addCustomer } from '../utils/customerUtils';
import ReactToPrint from 'react-to-print'

function ViewBillModalContent({show, table, kots, reload}){
    const [showModal, setShowModal] = useState(show);
    const [kotTableData, setTableData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const { menuItems} = useContext(AppContext)
    const [customerContact, setCustomerContact] = useState(""); 
    const [customerName, setCustomerName] = useState(""); 
    const [customerDob, setCustomerDob] = useState("");

    const columns = [
        {title: "Item", field: 'name'},
        {title: "Qty", field: 'qty'},
        {title: "Rate", field: 'rate'},
        {title: "Amount", field: 'amount'}
    ];

    useEffect(()=>{
        console.log("bill button clicked")
        let itemSummary = [];
        let uniqueItems = {};
        kots.forEach((kot)=>{
            kot["kotItems"].forEach((kotItem)=>{
                menuItems.forEach((item)=>{
                    if(kotItem.itemId === item.id){
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
        let finalAmount = 0;
        let finalQty = 0;
        Object.keys(uniqueItems).forEach((itemId)=>{
            itemSummary.push(uniqueItems[itemId]);
            finalAmount += uniqueItems[itemId]["amount"];
            finalQty += uniqueItems[itemId]["qty"];
        });
        setTableData(itemSummary);
        setTotalAmount(finalAmount);
        setTotalQty(finalQty);
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
        console.log("clickkkkkkkk");
        console.log(table)
        // let customerDetails = {
        //     "name": customerName,
        //     "contact": customerContact,
        //     "dob": customerDob
        // }
        // console.log(customerDetails)
        // if(customerContact){
        //     addCustomer(customerDetails);
        // }
        // let invoice_resp = await doBill(kotTableData, table.id, customerDetails);
        // table = invoice_resp.data;
        setShowModal(false);
    }

    let componentRef = useRef(null);
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
                    <div className=''>
                        <MyTable data={kotTableData} columns={columns}/>
                    </div>
                    <div className='print-test bord-bottom'>
                        Sub Total: {totalAmount}
                    </div>
                    <div className='print-test bord-bottom'>
                        Total Qty: {totalQty}
                    </div>
                    <div className='no-print ticket' ref={el=>(componentRef=el)}>
                        <div className='no-print bill-title'>
                            <div className='titlebold'>{'UNIBUCKS COFFEE'}</div>
                            <div>{'9th B Road Sardarpura, Jodhpur'}</div>
                            <div className='padd-bottom'>{'GST-XCDFTYIJYKIUY765378i'}</div>
                        </div>

                        <div className='no-print print-name'> {'Name: '}{customerName}</div>
                        <div className='no-print print-row border-bottom'>
                            <div className='print-col'>
                                <div>{'Date'}</div>
                            </div>
                            <div className='print-col padd-bottom'>
                                <div>{'Dine in: '}{table.tableNo}</div>
                                <div>{'Bill no.: '}{table.orderId}</div>
                            </div>
                        <div className='border-bottom padd-bottom'>
                            <MyTable data={kotTableData} columns={columns}/>
                        </div>
                        <div className='print-test bord-bottom'>
                            Sub Total: {totalAmount}
                        </div>
                        <div className='print-test bord-bottom padd-bottom'>
                            Total Qty: {totalQty}
                        </div>
                        </div>
                        <div className='no-print foot-text'>
                            {'Thank you text'}
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <ReactToPrint 
                    trigger={()=>{
                        return <Button>Print Bill</Button>
                    }}
                    content={()=>componentRef}
                    pageStyle="print"
                    onBeforePrint={handlePrintBill}
                    onAfterPrint={()=>{reload()}}
                />
            </Modal.Footer>
        </Modal>
    )
}

export default ViewBillModalContent;