import React, { useState, useEffect } from "react";
import { SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { HiUsers, HiTruck, HiCash, HiShoppingCart } from "react-icons/hi";
import {
  MdLocalLaundryService,
  MdIron,
} from "react-icons/md";
import washingsvg from "./../../assets/washing-machine.svg";
import {
  FcSalesPerformance,
  FcEngineering,
} from "react-icons/fc";
import { LuListOrdered } from "react-icons/lu";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

import Header from "./Header";
const { Sider, Content } = Layout;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const iconStyle = {
  fontSize: "24px", // Tamaño deseado para los iconos
  margin: "auto", // Centra horizontalmente
  marginTop: "7px",
  marginLeft: "-3px", // Espacio vertical opcional
};

const items = [
  getItem(
    "Autoservicio",
    "/menuPuntoVenta",
    <FcSalesPerformance style={iconStyle} />
  ),
  getItem(
    "Lavanderia",
    "/lavanderia",
    <MdLocalLaundryService style={iconStyle} />,
    [
      getItem("Encargo", "/encargo"),
      getItem("Recepcion", "/recepcion"),
      getItem("Entrega", "/entrega"),
    ]
  ),
  getItem("Planchado", "/planchado", <MdIron style={iconStyle} />, [
    getItem("Recepcion", "/recepcion"),
    getItem("Entrega", "/entrega"),
  ]),
  getItem("Pedidos", "/pedidos", <LuListOrdered style={iconStyle} />, [
    getItem("Lavanderia", "/pedidosLavanderia"),
    getItem("Planchado", "/pedidosPlanchado"),
  ]),
  getItem("Clientes", "/clients", <HiShoppingCart style={iconStyle} />),

  getItem("Caja", "/cajas", <HiCash style={iconStyle} />, [
    getItem("Inicio de caja", "/cajas"),
    getItem("Corte de caja Turno", "/corteCajaTurno"),
    getItem("Corte de caja Parcial", "/corteCajaParcial"),
    getItem("Retiro de caja", "/retiroCaja"),
    getItem("Reembolsos", "/reembolsos"),
  ]),
  getItem("Equipos", "/equipos", <HiTruck style={iconStyle} />, [
    getItem("Equipos", "/equipos"),
    getItem("Activar Equipos", "/activarEquipos"),
    getItem("Administrar Equipos", "/adminEquipos"),
  ]),

  getItem("Usurarios", "/users", <HiUsers style={iconStyle} />),
  getItem("Servicios", "/services", <FcEngineering style={iconStyle} />),

  { type: "divider", style: { margin: "122px " } },

  getItem("Settings", "/settings", <SettingOutlined style={iconStyle} />), // Agregado: Settings
  getItem("Logout", "/logout", <LogoutOutlined style={iconStyle} />),
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className=" flex flex-col min-h-screen">
      <Sider
        className={` ${collapsed ? "text-center" : ""}`}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="h-16 flex items-center gap-2 px-1 pt-1.5x">
          <div className="flex items-center pl-3.5">
            {" "}
            {/* Contenedor flex */}
            <img
              src={washingsvg}
              alt="Lavadora"
              className={`mx-auto ${collapsed ? "w-11 h-11" : "w-24  h-11"}`}
            />
            <span
              className={`font-semibold text-neutral-200 text-lg pr-6 ${
                collapsed ? "opacity-0" : "opacity-100"
              } transition-opacity`}
            >
              Laundry System
            </span>
          </div>
        </div>
        <div className="max-h-[calc(100vh-64px)] overflow-y-auto ">
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
        <Content className="bg-white rounded-lg m-3 p-3 min-h-80 mb-4">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
