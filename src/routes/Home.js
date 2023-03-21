import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Axios from 'axios';


function Home() {

    const [salesData, setSalesData] = useState([]);
    const [salesCountData, setSalesCountData] = useState([]);
    const [paymentModeData, setPaymentModeData] = useState([]);
    
    useEffect(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'userId':'1'
        }
        Axios.get("http://localhost:8080/analytics/api/v1/getSales", {params: {salesAggType: 'DAILY'}}, {headers: headers})
        .then((res)=>{
            let data = res.data;
            setSalesData(data);
        });

        Axios.get("http://localhost:8080/analytics/api/v1/getSalesCountAgg", {params: {salesAggType: 'DAILY'}}, {headers: headers})
        .then((res)=>{
            let data = res.data;
            setSalesCountData(data);
        });

        Axios.get("http://localhost:8080/analytics/api/v1/getPaymentModeAgg", {params: {salesAggType: 'DAILY'}}, {headers: headers})
        .then((res)=>{
            let data = res.data;
            let dataObj = {};
            let finalData = [];
            data.forEach(item => {
                if(!dataObj[item.date]){
                    dataObj[item.date] = {};
                }
                dataObj[item.date][item.modeOfPay] = item.amount
            });
            Object.keys(dataObj).forEach((date)=>{
                let obj = dataObj[date]
                obj["date"] = date;
                finalData.push(obj);
            });
            setPaymentModeData(finalData);
        });
    }, []);

    return (
        <div>
            <div className='daily-sales'>
                <BarChart
                width={600}
                height={300}
                data={salesData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="blue" label={{ position: 'top' }} />
                </BarChart>
            </div>
            <div className='daily-sales'>
                <BarChart
                width={600}
                height={300}
                data={salesCountData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orderCount" fill="blue" label={{ position: 'top' }} />
                </BarChart>
            </div>
            <div className='daily-sales'>
                <BarChart
                width={600}
                height={300}
                data={paymentModeData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="CASH" fill="blue" label={{ position: 'top' }} />
                    <Bar dataKey="ONLINE" fill="green" label={{ position: 'top' }} />
                </BarChart>
            </div>
        </div>
      );
}

export default Home;