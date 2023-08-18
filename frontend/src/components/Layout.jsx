import React from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css"
import Sidebar from "./Sidebar.jsx";
import Header from "./Header";

export default function Layout() {
    return (
        <div className="Container">
        <Sidebar/>
            <div className="Hidden">
                <Header/> 
                <div>{<Outlet/>}</div>
            </div>
        </div>
        
    )
}