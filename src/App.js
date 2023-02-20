import React, { useEffect, useState } from 'react';
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Invoice from "./routes/Invoice";
import Billing from "./routes/Billing";
import TableView from "./routes/TableView";
import {AppContext} from "./context"
import Axios from 'axios';

function App(){

    // const [tableView, setTableState] = useState({});
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [itemMap, setItemMap] = useState({});

    useEffect(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'userId':'1'
        }
        Axios.get("http://localhost:8080/category-service/api/v1/getCategories", {headers: headers})
        .then((res)=>{
            setCategories(res.data);
        });

        // Axios.get("http://localhost:8080/table/api/v1/getAllTables", {headers: headers})
        // .then((res)=>{
        //     console.log(res.data);
        //     let tableStateData = res.data;
        //     let tableView = {};
        //     tableStateData.forEach(table => {
        //         if(!(table['type'] in tableView)){
        //             tableView[`${table['type']}`] = [];
        //         }
        //         table["settleModal"] = false;
        //         tableView[`${table['type']}`].push(table);
        //     });
        //     setTableState(tableView);
        // });

        Axios.get("http://localhost:8080/item-service/api/v1/all-items", {headers: headers})
        .then((res)=>{
            setMenuItems(res.data);
            let itemMap = {};
            res.data.forEach(item => {
                itemMap[item.id] = item.name;
            });
            setItemMap(itemMap);
        });   
    }, []);

    const AppLayout = () => (
        <>
        <Navbar />
        <Outlet />
        </>
    );

    const router = createBrowserRouter([
    //   {
    //     path: "/",
    //     element: <Home />,
    //     loader: rootLoader,
    //     children: [
    //       {
    //         path: "team",
    //         element: <Team />,
    //         loader: teamLoader,
    //       },
    //     ],
    //   },
        {
            path: "/login",
            element: <Login />
        },
        
        {
            element: <AppLayout />,
            children: [
                {
                    path: "/",
                    element: <Home />
                },
                {
                    path: "/tables",
                    element: <TableView />
                },
                {
                    path: "/invoice",
                    element: <Invoice />
                },
                {
                    path: "/stock",
                    element: <Invoice />
                },
                {
                    path: "/tables/billing",
                    element: <Billing />
                }
            ]
        },
    
    ]);

    return (
        <AppContext.Provider value={{categories, menuItems, itemMap}}>
            <RouterProvider router={router} />
        </AppContext.Provider>
    )
}

export default App;







// ReactDOM.createRoot(document.getElementById("root")).render(
//     <RouterProvider router={router} />
// );
