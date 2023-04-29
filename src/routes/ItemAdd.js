import React, { useEffect, useState, useContext } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Axios from 'axios';
import { AppContext } from '../context';

function ItemForm() {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [uom, setUom] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [rate, setRate] = useState('');
    const [onlineRate, setOnlineRate] = useState('');
    const [category, setCategory] = useState('');
    const {categories} = useContext(AppContext)

  const handleSubmit = (event) => {
    document.getElementById("item-add-button").disabled = true;
    event.preventDefault();
    const url = "http://localhost:8080/item-service/api/v1/addItem"
    const headers = {
        'Content-Type': 'application/json',
        'userId':'1'
    }
    let body = {}
    body['name']= itemName;
    body['description'] = description;
    body['manufacturer'] = manufacturer;
    body['categoryId'] = category;
    body['uom'] = uom;
    body['rate'] = rate;
    body['onlineRate'] = onlineRate;
    body["orgId"] = 1;
    body["branchId"] = 1;
    body["inventoryId"] = 1;
    Axios.post(url, body, headers).then((res)=>{
        console.log(res);
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="container my-4">
      <h3 className="text-center mb-4">Add Item</h3>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="itemName" className="mb-3">
            <Form.Label>Item Name*</Form.Label>
            <Form.Control
            type="text"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            required
            />
        </Form.Group>
        <Form.Group as={Col} controlId="uom" className="mb-3">
            <Form.Label>Uom*</Form.Label>
            <Form.Control
            type="text"
            value='qty'
            disabled='true'
            onChange={(event) => setUom(event.target.value)}
            required
            />
        </Form.Group>
        <Form.Group as={Col} controlId="manufacturer" className="mb-3">
            <Form.Label>Manufacturer</Form.Label>
            <Form.Control
            type="text"
            value='Unibucks'
            disabled='true'
            onChange={(event) => setManufacturer(event.target.value)}
            />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="rate" className="mb-3">
            <Form.Label>Rate*</Form.Label>
            <Form.Control
            type="number"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            required
            />
        </Form.Group>
        <Form.Group as={Col} controlId="onlineRate" className="mb-3">
            <Form.Label>Online Rate*</Form.Label>
            <Form.Control
            type="number"
            value={onlineRate}
            onChange={(event) => setOnlineRate(event.target.value)}
            required
            />
        </Form.Group>
        <Form.Group as={Col} controlId="description" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
            as="textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="category" className="mb-3">
            <Form.Label>Category*</Form.Label>
            <Form.Select
            value={category}
            required
            onChange={(event) => setCategory(event.target.value)}
            >
            <option value="">Select a category</option>
            {categories.map((category) => (
                <option key={category.name} value={category.id}>
                {category.name}
                </option>
            ))}
            </Form.Select>
        </Form.Group>
      </Row>
      <Button id="item-add-button" type="submit" variant="primary">
        Submit
      </Button>
    </Form>
  );
}

export default ItemForm;

