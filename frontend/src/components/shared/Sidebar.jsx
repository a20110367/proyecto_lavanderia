import React, { useState, useEffect } from "react";
import washingsvg from "./../../assets/washing-machine.svg";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Items from './Items'

import Header from "./Header";
const { Sider, Content } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");
  const items = Items()

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="Layout">
      <Sider
        className={` ${collapsed ? "text-center" : ""}`}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="img-container-side">
          <div className="img-side">
            {" "}
            {/* Contenedor flex */}
            <img
              src={washingsvg}
              alt="Lavadora"
              className={`mx-auto ${collapsed ? "w-11 h-11" : "w-24  h-11"}`}
            />
            <span
              className={`font-semibold text-neutral-200 text-lg pr-6 ${collapsed ? "opacity-0" : "opacity-100"
                } transition-opacity`}
            >
              Laundry System
            </span>
          </div>
        </div>
        <div className="side-menu">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKeys]}
            items={[...items]}
            onClick={(item) => {
              setSelectedKeys(item.key);
              navigate(item.key);
            }}
          />
        </div>
      </Sider>
      <Layout className="bg-gray-800">
        <Header
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
          items={items}
        ></Header>
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
