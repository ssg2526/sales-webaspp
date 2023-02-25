import React, { useState, useContext } from 'react';
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
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { Card } from 'react-bootstrap';
// import {useTable} from 'react-table';

function Billing() {
    const [itemCode, setItemCode] = useState();
    const [itemName, setItemName] = useState("");
    const [itemData, setitemData] = useState([]);
    const [dob, setDob] = useState("");
    const { state } = useLocation();
    const [orderValue, setOrderValue] = useState(0.0);
    const [kotTableData, setTableData] = useState([]);

    function refreshKotData(data){
        setTableData(data);
    }

    const navigate = useNavigate();
    const {categories, menuItems, itemMap} = useContext(AppContext)

    const columns = [
        {title: "Item Code", field: 'itemCode', type:'text'},
        {title: "Item", field: 'name', type:'text'},
        {title: "Qty", field: 'qty', type:'buttons'},
        {title: "Price", field: 'price', type:'text'},
    ];

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

    function handleCatClick(category){
        let categoryItems = []
        menuItems.forEach((item)=>{
            if(item.categoryId === category.id){
                categoryItems.push(item);
            }
        });
        setitemData(categoryItems);
    }

    function handleQty(item, incr){
        let newItem = item;
        
        var newTableData = [];
        kotTableData.forEach(dataItem => {
            console.log(dataItem);
            if(dataItem.itemCode === newItem.itemCode){
                if(incr){
                    dataItem["qty"] = dataItem["qty"]+1;
                    setOrderValue(orderValue+newItem["rate"]);
                } else {
                    if(dataItem["qty"] > 0){
                        dataItem["qty"] = dataItem["qty"]-1;
                        setOrderValue(orderValue-newItem["rate"]);
                    }
                }
                dataItem["price"] = dataItem["rate"]*dataItem["qty"];
                if(dataItem["qty"] > 0){
                    newTableData.push(newItem);
                }
            } else {
                newTableData.push(dataItem);
            }
        });
        setTableData(newTableData);
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

    function handleKotCard(){

    }

    function handleBack(){
        navigate("/tables")
    }

    return (
        <div className='my-container'>
            <Row>
                <Col sm={2}>
                <div className='categ-list'>
                    <div className='categ-head'>Categories</div>
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
                <div className='item-scroll'>
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
                    <Tabs
                        defaultActiveKey="new-kot"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="new-kot" title="Kot">
                            <div>
                                <div>
                                    <MyTable data={kotTableData} handleQty={handleQty} columns={columns}/>
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
                        </Tab>
                        <Tab eventKey="old-kot" title="Kot History">
                            <div className='item-scroll'>
                                <Row>
                                {state.kotData.map((kot)=>{
                                    let dateTime = new Date(kot.createdAt);
                                    return(
                                        <div>
                                        <Card onClick={handleKotCard}>
                                            <Card.Header>{dateTime.toLocaleTimeString()}</Card.Header>
                                            <Card.Body>
                                                <ListGroup variant="flush">
                                                {kot.kotItems.map((kotItem)=>{
                                                    return(
                                                        <Row>
                                                            <Col>
                                                                {itemMap[kotItem["itemId"]]}
                                                            </Col>
                                                            <Col>
                                                                {kotItem.qty}
                                                            </Col>
                                                            <Col>
                                                                {kotItem.rate}
                                                            </Col>
                                                            <Col>
                                                                {kotItem.sellingPrice}
                                                            </Col>
                                                        </Row>
                                                        // <ListGroup.Item></ListGroup.Item>
                                                    )
                                                })}
                                                </ListGroup>
                                            </Card.Body>
                                        </Card>
                                        </div>
                                    );
                                })}
                                </Row>
                            </div>
                            <div className='btn'>
                                <Button onClick={handleBack}>Save</Button>
                            </div>
                            <div className='btn'>
                                <Button onClick={handleBack}>Back</Button>
                            </div>
                        </Tab>
                    </Tabs>
                    </div>
                 
                </Col>
            
                
            
            <div>
            
            </div>  
            </Row>
            </div>
    )
}

export default Billing;