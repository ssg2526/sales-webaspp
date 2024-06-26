import Axios from 'axios';

export function generateOrder(){
    const url = "http://localhost:8080/order/api/v1/generateOrder";
    const headers = {
        'Content-Type': 'application/json',
        'userId':'1'
    }
    const body = {
        "status":0,
        "orgId":1,
        "branchId":1
    }
    return Axios.post(url, body, headers)
}

export function generateKot(orderId, itemData){

    const url = "http://localhost:8080/kot/api/v1/addKot"
    const headers = {
        'Content-Type': 'application/json',
        'userId':'1'
    }
    let kot_body = {
        "orderId": orderId,
        "orgId":1,
        "branchId":1,
        "kotItems":[]
    }
    itemData.forEach((item)=>{
        let kot_item = {};
        kot_item["itemId"] = item.id;
        kot_item["rate"] = item.rate;
        kot_item["uom"] = item.uom;
        kot_item["qty"] = item.qty;
        kot_item["discountPer"] = item.discountPer;
        kot_item["sellingPrice"] = item.price;
        kot_body["kotItems"].push(kot_item);
    });
    return Axios.post(url, kot_body, headers)

}

export function updateSeatingData(table, status, orderId, orderValue){
    const url = "http://localhost:8080/table/api/v1/updateTable"
    const headers = {
        'Content-Type': 'application/json',
        'userId':'1'
    }
    let body = table;
    body["status"] = status;
    body["orderId"] = orderId;
    body["orderValue"] = orderValue;
    console.log(body);
    return Axios.put(url, body, headers);
}

export function generateInvoice(items, order_id){
    const url = "http://localhost:8080/sales-service/api/v1/addSales"
    const headers = {
        'Content-Type': 'application/json',
        'userId':'1'
    }
    let invoiceItems = [];
    let body = {};
    let billAmount = 0.0;
    items.forEach((item)=>{
        let invoiceItem = {};
        invoiceItem["itemId"] = item["itemId"];
        invoiceItem["rate"] = item["rate"];
        invoiceItem["uom"] = item["uom"];
        invoiceItem["qty"] = item["qty"];
        invoiceItem["discountPer"] = item["discountPer"];
        invoiceItem["sellingPrice"] = item["sellingPrice"];
        billAmount += item["sellingPrice"];
        invoiceItems.push(invoiceItem);
    });
    body["billAmount"] = billAmount;
    body["invoiceItems"] = invoiceItems;
    body["discountPer"] = 0.0;
    body["orderId"] = order_id;
    body["orgId"] = 1;
    body["branchId"] = 1;

    return Axios.post(url, body, headers);
}

export function getAllKotsForOrder(order_id){
    const url = "http://localhost:8080/kot/api/v1/getKotByOrder"
    const headers = {
        'Content-Type': 'application/json',
        'userId':'1'
    }

    return Axios.get(url, {params: {orderId: order_id}, headers: headers})
}