import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context';
import Axios from 'axios'
import Table from '../components/table';
import {generateOrder, generateKot, updateSeatingData, generateInvoice} from '../utils/billingUtils'
import { useLocation, useNavigate  } from "react-router-dom";
// import MaterialTable from 'material-table';
import { Col,Row, Container} from 'react-bootstrap'
// import {useTable} from 'react-table';

function Billing() {
    const [itemCode, setItemCode] = useState();
    const [itemName, setItemName] = useState("");
    const [itemData, setitemData] = useState([]);
    const [kotTableData, setTableData] = useState([]);
    const [dob, setDob] = useState("");
    const { state } = useLocation();
    const [orderValue, setOrderValue] = useState(state? state.seatingData.orderValue:{});

    const navigate = useNavigate();
    const {categories, menuItems} = useContext(AppContext)

    const columns = [
        {title: "Item Code", field: 'itemCode'},
        {title: "Item", field: 'name'},
        {title: "Qty", field: 'qty'},
        {title: "Price", field: 'price'},
    ];

    // console.log(state.kotData)

    function handleItemCode(e){
        setItemCode(e.target.value)
    }

    function unsetItemCode(){
        setItemCode("")
        console.log("item code: "+itemCode)
    }

    function _handleKeyUp(e) {
        if (e.key === 'Enter') {
            console.log("item Code: "+ itemCode)
            const url = "http://localhost:8080/item-service/api/v1/getitem";
            const headers = {
                'Content-Type': 'application/json',
                'userId':'1'
            }
            Axios.get(url, {params: {itemCode: itemCode}, headers: headers})
            .then((res)=>{
                setTableData(res.data);
            })
        }
    }

    function handleItemName(e){
        // const url = "http://localhost:8080/item-service/api/v1/contains";
        // const headers = {
        //     'Content-Type': 'application/json',
        //     'userId':'1'
        // }
        setItemName(e.target.value)
        console.log("search: "+ itemName)
        // Axios.get(url, {params: {searchText: itemName}, headers: headers})
        // .then((res)=>{
        //     setTableData(res.data);
        // })
    }

    function handle(e){
        // const newData = {...data}
        // newData[e.target.id] = e.target.value
        // setData(newData)
    }


    function handleCatClick(category){
        let categoryItems = []
        menuItems.forEach((item)=>{
            if(item.categoryId === category.id){
                categoryItems.push(item);
            }
        });
        setitemData(categoryItems);
    }

    function handleItemClick(item){
        let newItem = item;
        setOrderValue(orderValue+newItem["rate"]);
        var isItemExist = false;
        var newTableData = [];
        console.log(kotTableData);
        kotTableData.forEach(dataItem => {
            console.log(dataItem);
            if(dataItem.itemCode === newItem.itemCode){
                dataItem["qty"] = dataItem["qty"]+1;
                dataItem["price"] = dataItem["rate"]*dataItem["qty"];
                newTableData.push(newItem);
                isItemExist = true; 
            } else {
                newTableData.push(dataItem);
            }
        });
        if(!isItemExist){
            newItem["qty"] = 1;
            newItem["price"] = newItem["rate"];
            newTableData.push(newItem);
        }
        setTableData(newTableData);
    }

    async function handleKotButton(){
        let order_id = state.seatingData.orderId;
        if(! order_id){
            let res = await generateOrder()
            order_id = res.data.id;
        }
        let kot_details = await generateKot(order_id, kotTableData);
        let table_res = await updateSeatingData(state.seatingData, 1, order_id, orderValue);

        navigate("/tables")
    }

    async function handlePrintKotButton(){
        console.log("print kot")
        let order_id = state.seatingData.orderId;
        if(! order_id){
            let res = await generateOrder()
            order_id = res.data.id;
        }
        let kot_details = await generateKot(order_id, kotTableData);
        let table_res = await updateSeatingData(state.seatingData, 1, order_id, orderValue);
        console.log("table update: "+table_res.data);
        navigate("/tables")

    }

    async function handleBillButton(){
        console.log("bill button clicked")
        let order_id = state.seatingData.orderId;
        if(! order_id){
            let res = await generateOrder()
            order_id = res.data.id;
        }
        if(kotTableData){
            let kot_details = await generateKot(order_id, kotTableData);
            state.kotData.push(kot_details.data);
        }

        let itemSummary = [];
        let uniqueItems = {};
        state.kotData.forEach((kot)=>{
            kot["kotItems"].forEach((kotItem)=>{
                if(uniqueItems[kotItem.itemId]){
                    uniqueItems[kotItem.itemId]["qty"] += kotItem["qty"];
                    uniqueItems[kotItem.itemId]["sellingPrice"] += kotItem["sellingPrice"];
                } else {
                    uniqueItems[kotItem.itemId] = kotItem;
                }
            });
        });

        Object.keys(uniqueItems).forEach((itemId)=>{
            itemSummary.push(uniqueItems[itemId]);
        });

        let invoice_res = await generateInvoice(itemSummary, order_id);
        let billValue = invoice_res.data["billAmount"];
        let table_res = await updateSeatingData(state.seatingData, 2, order_id, billValue);
        navigate("/tables")
    }

    function handleBack(){
        navigate("/tables")
    }

    return (
        <Container>
            <Row>
                <Col>
                <div>
                    <ul>
                        {categories.map((category, index) => {
                            return (
                                <li key={category.name+index} onClick={()=>handleCatClick(category)}>
                                    <span>{category.name}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                </Col>

                <Col> 
                <input onChange={(e)=>handleItemCode(e)} 
                    onKeyUp={_handleKeyUp} id="itemCode" value={itemCode} placeholder='Item Code' type="text" />
                <input onChange={(e)=>handleItemName(e)} 
                    onClick={unsetItemCode} id="name" value={itemName} placeholder='Name' type="text" />
                {/* <button>Search</button> */}
                <div>
                    {itemData.map((item, index) => {
                        return (
                            <div key={index} onClick={()=>handleItemClick(item)}>
                                <span>{item.name}</span>
                            </div>
                        );
                    })}
                </div>
                </Col>

                <Col>
                
                <div>
                    <form>
                        <input onChange={(e)=>handleItemCode(e)} id="name" value={itemCode} placeholder='Name' type="text" />
                        <input onChange={(e)=>handleItemCode(e)} id="contact" value={itemCode} placeholder='Contact' type="text" />
                        <input onChange={(e)=>handle(e)} id="dob" value={dob} placeholder='Dob' type="date" />
                        {/* <button>Search</button> */}
                    </form>
                    <div>
                        <Table data={kotTableData} columns={columns}/>
                    </div>
                    <div>
                        <span>{orderValue}</span>
                    </div>
                    <div>
                        <div>
                            <button onClick={handleBillButton}>Print Bill</button>
                        </div>
                        <div>
                            <button onClick={handleKotButton}>KOT</button>
                        </div>
                        <div>
                            <button onClick={handlePrintKotButton}>Print KOT</button>
                        </div>
                        <div>
                            <button onClick={handleBack}>Back</button>
                        </div>
                    </div>
                </div> 
                </Col>
            
                
            
            <div>
            
            </div>  
            </Row>
        </Container>
    )
}

export default Billing;