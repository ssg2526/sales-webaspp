import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../context';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import MyTable from '../components/table';
import { doBill} from '../utils/billingUtils'
import { addCustomer } from '../utils/customerUtils';
import ReactToPrint from 'react-to-print'

function ViewBillModalContent(props){
    // const [showModal, setShowModal] = useState(show);
    const [kotTableData, setTableData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const { menuItems} = useContext(AppContext)
    const [customerContact, setCustomerContact] = useState(""); 
    const [customerName, setCustomerName] = useState(""); 
    const [customerDob, setCustomerDob] = useState("");

    const columns = [
        {title: "Item", field: 'name', type:'text'},
        {title: "Qty", field: 'qty', type: 'text'},
        {title: "Rate", field: 'rate', type: 'text'},
        {title: "Amount", field: 'amount', type: 'text'}
    ];

    useEffect(()=>{
        let itemSummary = [];
        let uniqueItems = {};
        props.kots.forEach((kot)=>{
            kot["kotItems"].forEach((kotItem)=>{
                menuItems.forEach((item)=>{
                    if(kotItem.itemId === item.id){
                        kotItem["name"] = item.name;
                    }
                });
                kotItem["amount"] = kotItem["sellingPrice"];
                if(uniqueItems[kotItem.itemId]){
                    uniqueItems[kotItem.itemId]["qty"] += kotItem["qty"];
                } else {
                    uniqueItems[kotItem.itemId] = kotItem;
                }
            });
        });
        let finalAmount = 0;
        let finalQty = 0;
        Object.keys(uniqueItems).forEach((itemId)=>{
            uniqueItems[itemId]["rate"] = 1*(uniqueItems[itemId]["rate"]*(20/21)).toFixed(2);
            uniqueItems[itemId]["sellingPrice"] = 1*(uniqueItems[itemId]["qty"]*uniqueItems[itemId]["rate"]).toFixed(2);
            uniqueItems[itemId]["amount"] = 1*(uniqueItems[itemId]["qty"]*uniqueItems[itemId]["rate"]).toFixed(2);
            
            itemSummary.push(uniqueItems[itemId]);
            finalAmount += uniqueItems[itemId]["amount"];
            finalQty += uniqueItems[itemId]["qty"];
        });
        setTableData(itemSummary);
        setTotalAmount(finalAmount);
        setTotalQty(finalQty);
    },[]);

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
        console.log(props.table)
        let customerDetails = {
            "name": customerName,
            "contact": customerContact,
            "dob": customerDob
        }
        console.log(customerDetails)
        if(customerContact){
            addCustomer(customerDetails);
        }
        let invoice_resp = await doBill(kotTableData, props.table.id, customerDetails);
    }

    let componentRef = useRef(null);
    return (
        <Modal show={props.show} onHide={props.close}>
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
                        Total Items: {totalQty}
                    </div>
                    <div>
                        CGST (2.5%): {(totalAmount*(2.5/100)).toFixed(2)}
                    </div>
                    <div>
                        SGST (2.5%): {(totalAmount*(2.5/100)).toFixed(2)}
                    </div>
                    <div>
                        Grand Total: {(totalAmount + totalAmount*(5/100)).toFixed(2)}
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
                                <div>{'Dine in: '}{props.table.tableNo}</div>
                                <div>{'Bill no.: '}{props.table.orderId}</div>
                            </div>
                        <div className='border-bottom padd-bottom'>
                            <MyTable data={kotTableData} columns={columns}/>
                        </div>
                        <div className='print-test'>
                            Sub Total: {totalAmount}
                        </div>
                        <div  className='print-test bord-bottom'>
                            Total Qty: {totalQty}
                        </div>
                        <div className='print-test'>
                            CGST (2.5%): {(totalAmount*(2.5/100)).toFixed(2)}
                        </div>
                        <div  className='print-test bord-bottom padd-bottom'>
                            SGST (2.5%): {(totalAmount*(2.5/100)).toFixed(2)}
                        </div>
                        <div className='print-grand'>
                            Grand Total: {(totalAmount + totalAmount*(5/100)).toFixed(2)}
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
                    onAfterPrint={()=>{props.close();props.reload()}}
                />
            </Modal.Footer>
        </Modal>
    )
}

export default ViewBillModalContent;