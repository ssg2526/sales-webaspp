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
    const [billSummaryData, setBillSummaryData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const { menuItems} = useContext(AppContext)
    const [customerContact, setCustomerContact] = useState(""); 
    const [customerName, setCustomerName] = useState(""); 
    const [customerDob, setCustomerDob] = useState("");
    const [discount, setDiscount] = useState();

    const columns = [
        {title: "Item", field: 'name', type:'text'},
        {title: "Qty", field: 'qty', type: 'text'},
        {title: "Rate", field: 'rate', type: 'text'},
        {title: "Amount", field: 'amount', type: 'text'}
    ];

    useEffect(()=>{
        let itemSummary = [];
        let billSummary = [];
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
                    uniqueItems[kotItem.itemId]["amount"] += kotItem["amount"];
                } else {
                    uniqueItems[kotItem.itemId] = kotItem;
                }
            });
        });
        let finalAmount = 0;
        let subTot = 0;
        let finalQty = 0;
        Object.keys(uniqueItems).forEach((itemId)=>{
            let billSummaryItem = JSON.parse(JSON.stringify(uniqueItems[itemId]));
            billSummaryItem["rate"] = 1*(billSummaryItem["rate"]*(20/21)).toFixed(2);
            billSummaryItem["sellingPrice"] = 1*(billSummaryItem["qty"]*billSummaryItem["rate"]).toFixed(2);
            billSummaryItem["amount"] = 1*(billSummaryItem["qty"]*billSummaryItem["rate"]).toFixed(2);
            
            itemSummary.push(uniqueItems[itemId]);
            billSummary.push(billSummaryItem);
            finalAmount += uniqueItems[itemId]["amount"];
            subTot += billSummaryItem["amount"];
            finalQty += uniqueItems[itemId]["qty"];
        });
        setTableData(itemSummary);
        setBillSummaryData(billSummary);
        setTotalAmount(finalAmount);
        setFinalAmount(finalAmount);
        setSubTotal(subTot);
        setTotalQty(finalQty);
    },[]);

    useEffect(()=>{
        console.log(totalAmount);
        if(discount){
            setFinalAmount(totalAmount-((totalAmount*discount)/100));
        }
    }, [discount]);

    function handleCustomerName(e){
        setCustomerName(e.target.value)
    }

    function handleCustomerContact(e){
        setCustomerContact(e.target.value)
    }

    function handleCustomerDob(e){
        setCustomerDob(e.target.value);
    }

    function handleDiscount(e){
        setDiscount(e.target.value);
    }

    async function handlePrintBill(){
        document.getElementById("save-n-print").disabled = true;
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
        // let invoice_resp = await doBill(kotTableData, props.table.id, customerDetails, discount);
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
                    <label htmlFor="discount">Discount:</label>
                        <input onChange={(e)=>handleDiscount(e)} id="discount" value={discount} type="number" min="0" max="100"/>
                    </div>
                    <div className='print-test bord-bottom'>
                        Total Amount: {finalAmount.toFixed(2)}
                    </div>
                    <div className='print-test bord-bottom'>
                        Total Items: {totalQty}
                    </div>
                    <div className='no-print ticket' ref={el=>(componentRef=el)}>
                        <div className='no-print bill-title'>
                            <div className='titlebold'>{'UNIBUCKS COFFEE'}</div>
                            <div>{'9th B Road Sardarpura, Jodhpur'}</div>
                            <div className='padd-bottom'>{'GST-08BEFPG3057P1Z5'}</div>
                        </div>

                        <div className='no-print print-name'> {'Name: '}{customerName}</div>
                        <div className='no-print print-row border-bottom'>
                            <div className='print-col'>
                                <div>{'Date: '}{new Date().toLocaleDateString()}</div>
                            </div>
                            <div className='print-col padd-bottom'>
                                <div>{'Dine in: '}{props.table.tableNo}</div>
                                <div>{'Bill no.: '}{props.table.orderId}</div>
                            </div>
                        <div className='border-bottom padd-bottom'>
                            <MyTable data={billSummaryData} columns={columns}/>
                        </div>
                        <div className='print-test'>
                            Sub Total: {(subTotal*1).toFixed(2)}
                        </div>
                        <div  className='print-test bord-bottom'>
                            Total Qty: {totalQty}
                        </div>
                        <div className='print-test'>
                            CGST (2.5%): {(subTotal*(2.5/100)).toFixed(2)}
                        </div>
                        <div  className='print-test bord-bottom padd-bottom'>
                            SGST (2.5%): {(subTotal*(2.5/100)).toFixed(2)}
                        </div>
                        <div className='print-grand'>
                            Grand Total: {totalAmount}
                        </div>
                        { (discount && discount>0)?
                            <div>
                                <div className='print-grand bord-bottom padd-bottom'>
                                    Discount: {discount}%
                                </div>
                                <div  className='print-grand bord-bottom padd-bottom'>
                                    Net Payable: {finalAmount}
                                </div>
                            </div>
                            :null
                        }
                        </div>
                        <div className='no-print foot-text'>
                            {'Thank you for visiting us!'}
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <ReactToPrint 
                    trigger={()=>{
                        return <Button id="save-n-print">Save & Print</Button>
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