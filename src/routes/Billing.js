import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context';
import Axios from 'axios'
import MyTable from '../components/table';
import { doKot, doBill} from '../utils/billingUtils'
import { useLocation, useNavigate  } from "react-router-dom";
// import MaterialTable from 'material-table';
// import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import Button from 'react-bootstrap/Button'
// import {useTable} from 'react-table';

function Billing() {
    const [itemCode, setItemCode] = useState();
    const [itemName, setItemName] = useState("");
    const [itemData, setitemData] = useState([]);
    const [dob, setDob] = useState("");
    const { state } = useLocation();
    const [orderValue, setOrderValue] = useState(0.0);
    const [kotTableData, setTableData] = useState([]);

    const navigate = useNavigate();
    const {categories, menuItems} = useContext(AppContext)

    const columns = [
        {title: "Item Code", field: 'itemCode'},
        {title: "Item", field: 'name'},
        {title: "Qty", field: 'qty'},
        {title: "Price", field: 'price'},
    ];

    useEffect(()=>{
        // let kotTable = [];
        // console.log(state);
        // state.kotData.forEach((kot)=>{
        //     kot.kotItems.forEach((kotItem)=>{
        //         console.log(kotItem);
        //         let oldKot = {};
        //         menuItems.forEach((item)=>{
        //             if(kotItem.itemId === item.id){
        //                 oldKot = Object.assign({}, item);
        //                 oldKot["qty"] = kotItem["qty"];
        //                 oldKot["price"] = kotItem["sellingPrice"];
        //                 kotTable.push(oldKot);
        //             }
        //         });
        //     });
        // });
        // setTableData(kotTable);
    },[]);

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
        setItemName(e.target.value)
        console.log("search: "+ itemName)
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
        if(kotTableData.length){
            let kot_resp = await doKot(kotTableData, state.seatingData.id);
            state.seatingData = kot_resp.data;
            console.log(kot_resp.data);
            // let table_res = await updateSeatingData(state.seatingData, 1, order_id, orderValue);
            navigate("/tables")
        }
    }

    async function handlePrintKotButton(){
        console.log("print kot")
        if(kotTableData.length){
            let kot_resp = await doKot(kotTableData, state.seatingData.id);
            state.seatingData = kot_resp.data;
            console.log(kot_resp.data);
            // let table_res = await updateSeatingData(state.seatingData, 1, order_id, orderValue);
            navigate("/tables")
        }
    }

    async function handleBillButton(){
        console.log("bill button clicked")
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
        let invoice_resp = await doBill(itemSummary, state.seatingData.id);
        state.seatingData = invoice_resp.data;
        navigate("/tables")
    }

    function handleSettle(){
        console.log("settled");
    }

    function handleBack(){
        navigate("/tables")
    }

    return (
            <Row>
                <Col sm={2}>
                <div className='categ-list'>
                    <ListGroup>
                        {categories.map((category, index) => {
                            return (
                                <ListGroupItem className='categ-items' key={category.name+index} onClick={()=>handleCatClick(category)}>
                                    <span>{category.name}</span>
                                </ListGroupItem>
                            );
                        })}
                    </ListGroup>
                </div>
                </Col>

                <Col sm={4}> 
                <input onChange={(e)=>handleItemCode(e)} 
                    onKeyUp={_handleKeyUp} id="itemCode" value={itemCode} placeholder='Item Code' type="text" />
                <input onChange={(e)=>handleItemName(e)} 
                    onClick={unsetItemCode} id="name" value={itemName} placeholder='Name' type="text" />
                {/* <button>Search</button> */}
                <div>
                    {itemData.map((item, index) => {
                        return (
                            <div className='item-card' key={index} onClick={()=>handleItemClick(item)}>
                                {item.name}
                            </div>
                        );
                    })}
                </div>
                </Col>

                <Col sm={6}>
                
                <div>
                    <div>
                        <MyTable data={kotTableData} columns={columns}/>
                    </div>
                    <div className='ord-total'>
                        <span>Total : {orderValue}</span>
                    </div>
                    {(state && state.seatingData.status !== 2)? 
                        (
                        <div>
                            {/* <div className='button-div'>
                                <Button disabled={!kotTableData.length?true:false} onClick={handleBillButton}>Print Bill</Button>
                            </div> */}
                            <div className='button-div'>
                                <Button disabled={!kotTableData.length?true:false} onClick={handleKotButton}>KOT</Button>
                            </div>
                            <div className='button-div'>
                                <Button disabled={!kotTableData.length?true:false} onClick={handlePrintKotButton}>Print KOT</Button>
                            </div>
                            <div className='btn'>
                                <Button onClick={handleBack}>Back</Button>
                            </div>
                        </div>
                        ):
                        <div></div>
                    }
                </div> 
                </Col>
            
                
            
            <div>
            
            </div>  
            </Row>
    )
}

export default Billing;