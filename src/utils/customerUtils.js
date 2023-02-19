import Axios from 'axios';

export function addCustomer(customerDetails){
    const url = "http://localhost:8080/customer/api/v1/addCustomer";
    const headers = {
        'Content-Type': 'application/json',
        'userId':'1'
    }
    return Axios.post(url, customerDetails, headers)
}