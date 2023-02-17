import React, { useState } from 'react';
import Axios from 'axios'
import Table from '../components/table';
// import MaterialTable from 'material-table';
// import {useTable} from 'react-table';

function Home() {
    const [itemCode, setItemCode] = useState();
    const [itemName, setItemName] = useState("");

    const [tableData, setTableData] = useState([]);

    const columns = [
        {title: "Item Code", field: 'itemCode'},
        {title: "Item", field: 'name'},
        {title: "Rate", field: 'rate'},
        {title: "Qty", field: 'qty'}

    ]

    function handleItemCode(e){
        setItemCode(e.target.value)
    }

    function unsetItemCode(){
        setItemCode("")
        console.log("item code: "+itemCode)
    }

    function _handleKeyDown(e) {
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

    return (
        <div>
            <form className='invoice'>
                <input onChange={(e)=>handleItemCode(e)} 
                    onKeyDown={_handleKeyDown} id="itemCode" value={itemCode} placeholder='Item Code' type="text" />
                <input onChange={(e)=>handleItemName(e)} 
                    onClick={unsetItemCode} id="name" value={itemName} placeholder='Name' type="text" />
                {/* <button>Search</button> */}
            </form>    
            <div>
                <Table data={tableData} columns={columns}/>

            </div>
        </div>
    )
}

export default Home;