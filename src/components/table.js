function Table({data, columns}){
    // console.log(data);
    return (
        <table className='table'>
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
        </table>
    )
}

const TableHeaders = ({header}) => <th>{header.title}</th>
const TableRow = ({item, columns}) => {
    // console.log(item);
    return <tr key={item.id}>
        {columns.map((columnItem, index) => {
            return <td key={index}>{item[`${columnItem.field}`]}</td>
        })}
    </tr>
    // <tr>
    //     {columns.map((columnItem, index) => {
    //         console.log(`${columnItem.value}` + "-->" +item[`${columnItem.value}`]);
    //         return <td>{item[`${columnItem.value}`]}</td>
    //     })}
    // </tr>
}

export default Table;