import Axios from 'axios';
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext } from '../context';
import { useNavigate } from "react-router-dom";
import { getAllKotsForOrder } from '../utils/billingUtils';

function TableView(){

    const navigate = useNavigate ();

    const {tableView} = useContext(AppContext)

    async function handleTableClick(table){
        //make call to get kots
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
        })

    }

    return(
        <div>
            {Object.keys(tableView).map((type, index)=>{
                return(
                    <div key={index} className='seating-view'>
                        <div className='table-type'>{type}</div>
                        <div className='card-layout'>
                            {tableView[type].map((table, index) =>{
                                return (
                                    <div key={index} onClick={()=>handleTableClick(table)} className={'card '+ 'st'+table.status}>
                                        <div className='card-top'>
                                            <span>{table.tableNo}</span>
                                        </div>
                                        <div className='card-body'>
                                            <span>{table.orderValue? '₹'+table.orderValue: null}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
                
            })}
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