import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Axios from 'axios';


function Home() {
    const aggTypes = [{
        key: 'Daily',
        value: 'DAILY'
    }, {
        key: 'Monthly',
        value: 'MONTHLY'
    }];
    const [salesData, setSalesData] = useState([]);
    const [salesCountData, setSalesCountData] = useState([]);
    const [paymentModeData, setPaymentModeData] = useState([]);
    const [aggType, setAggType] = useState('DAILY');
    
    useEffect(()=>{
        getAggs(aggType);
    }, []);

    function handleAggChange(newAggType){
        setAggType(newAggType);
        getAggs(newAggType);
    }

    function getAggs(aggType){
        const headers = {
            'Content-Type': 'application/json',
            'userId':'1'
        }
        Axios.get("http://localhost:8080/analytics/api/v1/getSales", {params: {salesAggType: aggType}}, {headers: headers})
        .then((res)=>{
            let data = res.data;
            setSalesData(data);
        });

        Axios.get("http://localhost:8080/analytics/api/v1/getSalesCountAgg", {params: {salesAggType: aggType}}, {headers: headers})
        .then((res)=>{
            let data = res.data;
            setSalesCountData(data);
        });

        Axios.get("http://localhost:8080/analytics/api/v1/getPaymentModeAgg", {params: {salesAggType: aggType}}, {headers: headers})
        .then((res)=>{
            let data = res.data;
            let dataObj = {};
            let finalData = [];
            let key = aggType === 'DAILY'? 'date':'month';
            data.forEach(item => {
                if(!dataObj[item[key]]){
                    dataObj[item[key]] = {};
                }
                dataObj[item[key]][item.modeOfPay] = item.amount
            });
            Object.keys(dataObj).forEach((val)=>{
                let obj = dataObj[val]
                obj[key] = val;
                finalData.push(obj);
            });
            setPaymentModeData(finalData);
        });
    }

    return (
        <div>
            <div className='agg-type'>
                <Form.Group as={Row} controlId="aggType">
                    <Form.Label column sm={4}></Form.Label>
                    <Col sm={4}>
                    <Form.Select
                    value={aggType}
                    required
                    onChange={(event) => handleAggChange(event.target.value)}
                    >
                    <option value="">Select a type</option>
                    {aggTypes.map((type) => (
                        <option key={type.key} value={type.value}>
                        {type.key}
                        </option>
                    ))}
                    </Form.Select>
                    </Col>
                </Form.Group>
            </div>
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
                        <XAxis dataKey={aggType === 'DAILY'? 'date': 'month'} />
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
                        <XAxis dataKey={aggType === 'DAILY'? 'date': 'month'} />
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
                        <XAxis dataKey={aggType === 'DAILY'? 'date': 'month'} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="CASH" fill="blue" label={{ position: 'top' }} />
                        <Bar dataKey="ONLINE" fill="green" label={{ position: 'top' }} />
                    </BarChart>
                </div>
            </div>

        </div>
      );
}

export default Home;