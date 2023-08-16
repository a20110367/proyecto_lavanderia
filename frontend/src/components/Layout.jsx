import React from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css"
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
    return (
        <div className="Container">
        <Sidebar/>
            <div className="Hidden">
                <div className="Header">header</div>
                <div>{<Outlet/>}</div>
            </div>
        </div>
        
    )
}