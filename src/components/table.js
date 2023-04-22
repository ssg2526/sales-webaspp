import {Table} from 'react-bootstrap';

function MyTable(props){

    function handleAddQty(item){
        item['qty']++;
    }
    
    
    function handleSubtractQty(item){
        if(item['qty'] >= 0){
            item['qty']--;
        }
    }
    // console.log(data);

    const TableHeaders = ({header}) => <th>{header.title}</th>
    const TableRow = ({item}) => {
        // console.log(item);
        return <tr key={item.id}>
            {props.columns.map((columnItem, index) => {
                if(columnItem.field === 'qty' && columnItem.type === 'buttons'){
                    return <td key={index}> <button onClick={()=>props.handleQty(item, false)} className='qtyBtn'>{'-'}</button> {item[`${columnItem.field}`]} <button onClick={()=>props.handleQty(item, true)} className='qtyBtn'>{'+'}</button> </td>
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
                    {props.columns.map((item, index) => 
                        <TableHeaders key={index} header={item} />
                    )}
                </tr>
            </thead>
            <tbody>
                {props.data.map((item, index) => 
                    <TableRow key={index} item={item}/>
                )}
            </tbody>
        </Table>
    )
}

export default MyTable;