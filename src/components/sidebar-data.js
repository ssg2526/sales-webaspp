import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Tables",
    path: "/tables",
    icon: <AiIcons.AiFillAccountBook />,
    cName: "nav-text",
  },
  {
    title: "Invoice",
    path: "/invoice",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  }
];