import React, { useContext, useState } from 'react';
import { AppContext } from '../context';
import { useNavigate } from "react-router-dom";
import { getAllKotsForOrder } from '../utils/billingUtils';
import SettleModalContent from '../components/settle-modal'
import Button from 'react-bootstrap/Button'

function TableView(){

    const navigate = useNavigate ();

    const {tableView} = useContext(AppContext)
    const [openModal, setOpenModal] = useState(false);
    const [currentSeating, setCurrentSeating] = useState({});

    async function handleTableClick(table){
        //make call to get kots
        console.log(table);
        if(table.status !== 2){
            let kot_data = []
            if(table.orderId){
                let res = await getAllKotsForOrder(table.orderId);
                kot_data = res.data;
                console.log(kot_data);
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
        if(openModal === true){
            setOpenModal(false);
        } else {
            setOpenModal(true);
        }
        
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
                                    <div key={index}>
                                        <div onClick={()=>handleTableClick(table)} className={'card '+ 'st'+table.status}>
                                            <div className='card-top'>
                                                {table.tableNo}
                                            </div>
                                            <div className='card-body'>
                                                {table.orderValue? '₹'+table.orderValue: null}
                                            </div>
                                        </div>
                                        {table.status === 2? 
                                        <div className='button-div'>
                                            <Button onClick={(e)=>handleSettleClick(table)}>Settle</Button>
                                        </div>:null
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
            {openModal? <SettleModalContent show={openModal} table={currentSeating} />: null}
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