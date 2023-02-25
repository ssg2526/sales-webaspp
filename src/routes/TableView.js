import React, { useContext, useEffect, useReducer, useState } from 'react';
import { AppContext } from '../context';
import { useNavigate } from "react-router-dom";
import { getAllKotsForOrder } from '../utils/billingUtils';
import SettleModalContent from '../components/settle-modal'
import ViewBillModalContent from '../components/view-bill-modal';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';

function TableView(){

    const navigate = useNavigate ();

    const [tableView, setTableState] = useState([]);
    const [openSettleModal, setViewSettleModal] = useState(false);
    const [openViewBillModal, setViewBillModal] = useState(false);
    const [currentSeating, setCurrentSeating] = useState({});
    const [currentTableKots, setCurrentTableKots] = useState([]);
    const [ignored, forceUpdate] = useReducer(x=> x+1, 0);


    useEffect(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'userId':'1'
        }
        Axios.get("http://localhost:8080/table/api/v1/getAllTables", {headers: headers})
        .then((res)=>{
            let tableStateData = res.data;
            let tableView = {};
            tableStateData.forEach(table => {
                if(!(table['type'] in tableView)){
                    tableView[`${table['type']}`] = [];
                }
                table["settleModal"] = false;
                tableView[`${table['type']}`].push(table);
            });
            setTableState(tableView);
        });
    }, [ignored]);

    async function handleTableClick(table){
        if(table.status !== 2){
            let kot_data = []
            if(table.orderId){
                let res = await getAllKotsForOrder(table.orderId);
                kot_data = res.data;
            }
            navigate('billing', {
                state: {
                    seatingData: table,
                    kotData: kot_data
                }
            });
        }
    }

    function handleSettleClick(table){
        console.log("clicked");
        setCurrentSeating(table);
        console.log("table set");
        setViewSettleModal(true);
    }

    async function handleBillClick(table){
        setCurrentSeating(table);
        let kot_data = []
        if(table.orderId){
            let res = await getAllKotsForOrder(table.orderId);
            kot_data = res.data;
            setCurrentTableKots(kot_data);
        }
        console.log("table set");
        setViewBillModal(true);
    }

    return(
        <div className='my-container'>
            {Object.keys(tableView).map((type, index)=>{
                return(
                    <div key={index} className='seating-view'>
                        <div className='table-type'>{type}</div>
                        <div className='card-layout'>
                            {tableView[type].map((table, index) =>{
                                return (
                                    <div key={index}>
                                        <div onClick={()=>handleTableClick(table)} className={'mycard '+ 'st'+table.status}>
                                            <div className='mycard-top'>
                                                {table.tableNo}
                                            </div>
                                            <div className='mycard-body'>
                                                {table.orderValue? '₹'+table.orderValue: null}
                                            </div>
                                        </div>
                                        {table.status === 2? 
                                        <div className='button-div'>
                                            <Button onClick={(e)=>handleSettleClick(table)}>Settle</Button>
                                        </div>:table.status === 1?
                                        <div className='button-div'>
                                            <Button onClick={(e)=>handleBillClick(table)}>Bill</Button>
                                        </div>:null
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
            {
                openSettleModal?
                <SettleModalContent show={openSettleModal} close={()=>setViewSettleModal(false)} reload={()=>forceUpdate()} table={currentSeating}/>:null}
            {
                openViewBillModal?
                <ViewBillModalContent show={openViewBillModal} close={()=>setViewBillModal(false)} reload={()=>forceUpdate()} table={currentSeating} kots={currentTableKots} />:null
            }
        </div>
    )
}

    // const [tableView, setTableView] = useState({});

    // useEffect(()=>{
    //     var tempTableView = {};
    //     tableStateData.forEach(table => {
    //         if(!(table['type'] in tableView)){
    //             tempTableView[`${table['type']}`] = [];
    //         }
    //         tempTableView[`${table['type']}`].push(table);
    //     });
    //     setTableView(tempTableView);
    // }, []);

export default TableView