import {Table} from 'react-bootstrap';

function MyTable({data, refreshKotData, columns}){

    function handleAddQty(item){
        console.log(data);
        item['qty']++;
        refreshKotData(data);
    }
    
    
    function handleSubtractQty(item){
        if(item['qty'] >= 0){
            item['qty']--;
        }
    }
    // console.log(data);

    const TableHeaders = ({header}) => <th>{header.title}</th>
    const TableRow = ({item, columns}) => {
        // console.log(item);
        return <tr key={item.id}>
            {columns.map((columnItem, index) => {
                if(columnItem.field == 'qty' && columnItem.type === 'buttons'){
                    return <td key={index}> <button onClick={()=>handleSubtractQty(item)} className='qtyBtn'>{'-'}</button> {item[`${columnItem.field}`]} <button onClick={()=>handleAddQty(item)} className='qtyBtn'>{'+'}</button> </td>
                }else{
                    return <td key={index}>{item[`${columnItem.field}`]}</td>
                }
            })}
        </tr>
        // <tr>
        //     {columns.map((columnItem, index) => {
        //         console.log(`${columnItem.value}` + "-->" +item[`${columnItem.value}`]);
        //         return <td>{item[`${columnItem.value}`]}</td>
        //     })}
        // </tr>
    }

    return (
        <Table striped borderless hover>
            <thead>
                <tr>
                    {columns.map((item, index) => 
                        <TableHeaders key={index} header={item} />
                    )}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => 
                    <TableRow key={index} item={item} columns={columns}/>
                )}
            </tbody>
        </Table>
    )
}

export default MyTable;