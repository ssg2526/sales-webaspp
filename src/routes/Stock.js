import React, { useState } from 'react';
import Axios from 'axios'
import Table from '../components/table';

function Home() {
    const [itemCode, setItemCode] = useState(2);
    const [itemName, setItemName] = useState();

    const [tableData, setTableData] = useState([]);

    const columns = [
        {heading: "Item Code", value: 'itemCode'},
        {heading: "Item", value: 'name'},
        {heading: "Rate", value: 'rate'},
        {heading: "Qty", value: 'qty'}

    ]


    function handleItemCode(e){
        const url = "http://localhost:8080/item-service/api/v1/getitem";
        const headers = {
            'Content-Type': 'application/json',
            'userId':'1'
        }
        // const newData = {...itemCode}
        // newData[e.target.id] = e.target.value
        setItemCode(e.target.value)
        console.log("item Code: "+ itemCode)
        Axios.get(url, {params: {itemCode: itemCode}, headers: headers})
        .then((res)=>{
            setTableData(res.data);
        })
    }

    function handleItemName(e){
        const url = "http://localhost:8080/item-service/api/v1/contains";
        const headers = {
            'Content-Type': 'application/json',
            'userId':'1'
        }
        setItemName(e.target.value)
        console.log("search: "+ itemName)
        Axios.get(url, {params: {searchText: itemName}, headers: headers})
        .then((res)=>{
            setTableData(res.data);
        })
    }

    // function submit(e){
    //     const url = "localhost:8080/item-service/api/v1/getitem";
    //     const headers = {
    //         'Content-Type': 'application/json',
    //         'userId':'1'
    //     }
    //     e.preventDefault();
    //     Axios.get(url, {params: {from: data.from, to: data.to}, headers: headers})
    //     .then((res)=>{
    //         var dataset = res.data.map((item)=>{
    //             var dateTime = new Date(item.createdAt);
    //             var date = dateTime.toLocaleDateString();
    //             var time = dateTime.toLocaleTimeString();
    //             item.date = date;
    //             item.time = time;
    //             return item;
    //         });
    //         setTableData(dataset);
    //     })
    // }
    return (
        <div>
            <form className='stock'>
                <input onChange={(e)=>handleItemCode(e)} id="itemCode" value={itemCode} placeholder='Item Code' type="text" />
                <input onChange={(e)=>handleItemName(e)} id="name" value={itemName} placeholder='Name' type="text" />
                {/* <button>Search</button> */}
            </form>    
            <div>
                <Table data={tableData} columns={columns}/>
            </div>
        </div>
    )
}

export default Home;