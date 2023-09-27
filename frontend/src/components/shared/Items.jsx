import React from 'react'
import {
    MdLocalLaundryService,
    MdIron,
} from "react-icons/md";
import {
    FcEngineering,
} from "react-icons/fc";
import { LuListOrdered } from "react-icons/lu";
import { SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { HiUsers, HiTruck, HiCash, HiShoppingCart } from "react-icons/hi";
import { useAuth } from '../../hooks/auth/auth'

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

const items1 = [
    getItem(
        "Lavanderia",
        "/lavanderia",
        <MdLocalLaundryService style={iconStyle} />,
        [
            getItem("Autoservicio", "/menuPuntoVenta",),
            getItem("Recepcion", "/recepcionLavanderia"),
            getItem("Entrega", "/entregaLavanderia"),

        ]
    ),
    getItem("Planchado", "/planchadoIron", <MdIron style={iconStyle} />, [
        getItem("Recepcion", "/recepcionPlanchado"),
        getItem("Entrega", "/entregaPlanchado"),
    ]),
    getItem("Pedidos", "/pedidos", <LuListOrdered style={iconStyle} />, [
        getItem("Lavanderia", "/pedidosLavanderia"),
        getItem("Planchado", "/pedidosPlanchado"),
    ]),
    getItem("Clientes", "/clients", <HiShoppingCart style={iconStyle} />),

    getItem("Caja", "/cajas", <HiCash style={iconStyle} />, [
        //getItem("Inicio de caja", "/cajas"),
        getItem("Corte de caja Turno", "/corteCajaTurno"),
        getItem("Corte de caja Parcial", "/corteCajaParcial"),
        getItem("Retiro de caja", "/retiro"),
        getItem("Reembolsos", "/reembolso"),
    ]),
    getItem("Equipos", "/equipos", <HiTruck style={iconStyle} />, [
        getItem("Lista de Equipos", "/equipos"),
        getItem("Activar Equipos", "/activarEquipos"),
        getItem("Administrar Equipos", "/adminEquipos"),
    ]),

    getItem("Usuarios", "/users", <HiUsers style={iconStyle} />),
    getItem("Servicios", "/services", <FcEngineering style={iconStyle} />),

    { type: "divider", style: { margin: "140px " } },

    getItem("Settings", "/settings", <SettingOutlined style={iconStyle} />), // Agregado: Settings
    getItem("Logout", "/logout", <LogoutOutlined style={iconStyle} />),
];

const items2 = [
    getItem(
        "Lavanderia",
        "/lavanderia",
        <MdLocalLaundryService style={iconStyle} />,
        [
            getItem("Autoservicio", "/menuPuntoVenta",),
            getItem("Recepcion", "/recepcionLavanderia"),
            getItem("Entrega", "/entregaLavanderia"),

        ]
    ),
    getItem("Planchado", "/planchadoIron", <MdIron style={iconStyle} />, [
        getItem("Recepcion", "/recepcionPlanchado"),
        getItem("Entrega", "/entregaPlanchado"),
    ]),
    getItem("Pedidos", "/pedidos", <LuListOrdered style={iconStyle} />, [
        getItem("Lavanderia", "/pedidosLavanderia"),
        getItem("Planchado", "/pedidosPlanchado"),
    ]),
    getItem("Añadir Clientes", "/addClient", <HiShoppingCart style={iconStyle} />),

    getItem("Caja", "/cajas", <HiCash style={iconStyle} />, [
        //getItem("Inicio de caja", "/cajas"),
        getItem("Corte de caja Turno", "/corteCajaTurno"),
        getItem("Corte de caja Parcial", "/corteCajaParcial"),
        getItem("Retiro de caja", "/retiro"),
        getItem("Reembolsos", "/reembolso"),
    ]),
    getItem("Equipos", "/equipos", <HiTruck style={iconStyle} />, [
        getItem("Lista de Equipos", "/equipos"),
        getItem("Activar Equipos", "/activarEquipos"),
        getItem("Administrar Equipos", "/adminEquipos"),
    ]),

    getItem("Servicios", "/services", <FcEngineering style={iconStyle} />),

    { type: "divider", style: { margin: "140px " } },

    getItem("Settings", "/settings", <SettingOutlined style={iconStyle} />), // Agregado: Settings
    getItem("Logout", "/logout", <LogoutOutlined style={iconStyle} />),
];


function Items() {
    const { cookies } = useAuth();
    return cookies.role === 'admin' ? items1 : items2
}

export default Items