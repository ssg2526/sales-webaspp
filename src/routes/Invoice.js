import React, { useState } from 'react';
import Axios from 'axios'
import Table from '../components/table';
// import MaterialTable from 'material-table';
// import {useTable} from 'react-table';

function Invoice() {
    const url = "http://localhost:8080/sales-service/api/v1/getInvoicesByDates";
    const headers = {
        'Content-Type': 'application/json',
        'userId':'1'
    }
    const [data, setData] = useState({
        from: "",
        to: ""
    });

    const [tableData, setTableData] = useState([]);

    const columns = [
        {title: "Invoice", field: 'invoiceNo'},
        {title: "Date", field: 'date'},
        {title: "Time", field: 'time'},
        {title: 'Amount', field: 'billAmount' }
    ]

    function handle(e){
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
    }

    function submit(e){
        e.preventDefault();
        Axios.get(url, {params: {from: data.from, to: data.to}, headers: headers})
        .then((res)=>{
            var dataset = res.data.map((item)=>{
                var dateTime = new Date(item.createdAt);
                var date = dateTime.toLocaleDateString();
                var time = dateTime.toLocaleTimeString();
                item.date = date;
                item.time = time;
                return item;
            });
            setTableData(dataset);
        })
    }
    return (
        <div>
            <form className='invoice' onSubmit={(e) => submit(e)}>
                <input onChange={(e)=>handle(e)} id="from" value={data.from} placeholder='Date From' type="date" />
                <input onChange={(e)=>handle(e)} id="to" value={data.to} placeholder='Date To' type="date" />
                <button>Search</button>
            </form>    
            <div>
                <Table data={tableData} columns={columns}/>
            </div>
        </div>
    )
}

export default Invoice;