import React, { useState, useEffect } from "react";
import {
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { HiUsers, HiTruck, HiCash, HiShoppingCart } from "react-icons/hi";
import {
  MdOutlineLocalLaundryService,
  MdLocalLaundryService,
} from "react-icons/md";
import { FcSalesPerformance, FcServices, FcFullTrash } from "react-icons/fc";
import { LuListOrdered } from "react-icons/lu";
import { Layout, Menu} from "antd";
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

const items = [
  getItem("Autoservicio", "/menuPuntoVenta", <FcSalesPerformance />),
  getItem("Lavanderia", "/sideBarLavanderia", <MdOutlineLocalLaundryService />, [
    getItem("Encargo", "/laundryEncargo"),
    getItem("Recepción", "/laundryRecepcion"),
    getItem("Entrega", "/laundryEntrega"),
  ]),
  getItem("Planchado", "/planchado", <MdLocalLaundryService />, [
    getItem("Recepcion", "/IronRecepcion"),
    getItem("Entrega", "/IronEntrega"),
  ]),
  getItem("Pedidos", "/pedidos", <LuListOrdered />, [
    getItem("Lavanderia", "/pedidosLavanderia"),
    getItem("Planchado", "/pedidosPlanchado"),
  ]),
  getItem("Clientes", "/clients", <HiShoppingCart />),

  getItem("Caja", "/sideBarCajas", <HiCash />, [
    getItem("Inicio de caja", "/cajas"),
    getItem("Corte de caja Turno", "/corteCajaTurno"),
    getItem("Corte de caja Parcial", "/corteCajaParcial"),
    getItem("Retiro de caja", "/retiroCaja"),
    getItem("Reembolsos", "/reembolsos"),
  ]),
  getItem("Equipos", "/sideBarEquipos", <HiTruck />, [
    getItem("Equipos", "/equipos"),
    getItem("Activar Equipos", "/activarEquipos"),
    getItem("Administrar Equipos", "/adminEquipos"),
  ]),

  getItem("Usuarios", "/users", <HiUsers />),
  getItem("Servicios", "/services", <FcServices />),

  { type: "divider", style: { margin: "122px " } },

  getItem("Settings", "settings", <SettingOutlined />), // Agregado: Settings
  getItem("Cerrar Sesión", '/logout', <LogoutOutlined />),
];

export default function Sidebar () {
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
    <Layout className="min-h-screen">
      <Sider
        className={` ${collapsed ? "text-center" : ""}`}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="h-16 bg-slate-900 flex items-center gap-2 px-1 py-3">
          <FcFullTrash
            fontSize={24}
            className={`mx-auto ${collapsed ? "w-full" : ""}`}
          />
          <span
            className={`text-neutral-200 text-lg pr-4 ${
              collapsed ? "hidden" : "block"
            }`}
          >
            Laundry System
          </span>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKeys]}
          items={[
            ...items, // Agrega los elementos del menú aquí
          ]}
          onClick={(item) => {
            setSelectedKeys(item.key);
            navigate(item.key);
          }}
          className="bg-slate-900"
        />
      </Sider>
      <Layout className="bg-gray-700">
        <Header
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
        ></Header>
        <Content className="bg-white rounded-lg m-3 p-3 min-h-80 mb-4">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
