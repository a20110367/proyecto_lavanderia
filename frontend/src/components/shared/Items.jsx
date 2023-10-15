import React from 'react'
import {
    MdLocalLaundryService,
    MdIron,
} from "react-icons/md";
import {
    FcEngineering,
} from "react-icons/fc";
import { LuListOrdered } from "react-icons/lu";
import { GiHandTruck} from "react-icons/gi";
import { SettingFilled, LogoutOutlined } from "@ant-design/icons";
import { HiUsers, HiTruck, HiCash, HiShoppingCart } from "react-icons/hi";
import { HiWrenchScrewdriver } from "react-icons/hi2"
import { RiHandCoinFill } from "react-icons/ri"
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
    fontSize: "24px", 
    margin: "auto", 
    marginTop: "7px",
    marginLeft: "-3px", 
};

const items1 = [
    getItem(
        "Lavanderia",
        "/lavanderia",
        <MdLocalLaundryService style={iconStyle} />,
        [
            getItem("Autoservicio", "/autoServicio",),
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
        getItem("General", "/pedidosGeneral"),
    ]),
    getItem("Clientes", "/clients", <HiShoppingCart style={iconStyle} />),

    getItem("Caja", "/cajas", <HiCash style={iconStyle} />, [
        getItem("Inicio de caja", "/inicioCaja"),
        getItem("Corte de caja", "/corteCaja"),

        getItem("Retiro de caja", "/retiro"),
        getItem("Reembolsos", "/reembolso"),
        getItem("Historial de cortes", "/historialCaja"),
        getItem("Pedidos", "/cajaPedidos"),
        
    ]),
    getItem("Equipos", "/equipos", <HiWrenchScrewdriver style={iconStyle} />, [
        getItem("Activar Equipos", "/activarEquipos"),
        getItem("Administrar Equipos", "/equipos"),
    ]),

    getItem("Usuarios", "/users", <HiUsers style={iconStyle} />),
    getItem("Servicios", "/services", <RiHandCoinFill style={iconStyle} />),

    { type: "divider", style: { margin: "140px " } },

    getItem("Settings", "/settings", <SettingFilled style={iconStyle} />), // Agregado: Settings
    getItem("Logout", "/logout", <LogoutOutlined style={iconStyle} />),
];

const items2 = [
    getItem(
        "Lavanderia",
        "/lavanderia",
        <MdLocalLaundryService style={iconStyle} />,
        [
            getItem("Autoservicio", "/autoServicio",),
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
        getItem("General", "/pedidosGeneral"),
    ]),
    getItem("Añadir Clientes", "/addClient", <HiShoppingCart style={iconStyle} />),

    getItem("Caja", "/cajas", <HiCash style={iconStyle} />, [
        //getItem("Inicio de caja", "/cajas"),
        getItem("Corte de caja Turno", "/corteCajaTurno"),
        getItem("Corte de caja Parcial", "/corteCajaParcial"),
        getItem("Retiro de caja", "/retiro"),
        getItem("Reembolsos", "/reembolso"),
        getItem("Pedidos", "/cajaPedidos"),
    ]),
    getItem("Equipos", "/equipos", <HiWrenchScrewdriver style={iconStyle} />, [
        getItem("Activar Equipos", "/activarEquipos"),
        getItem("Administrar Equipos", "/equipos"),
    ]),

    getItem("Servicios", "/services", <RiHandCoinFill style={iconStyle} />),

    { type: "divider", style: { margin: "140px " } },

    getItem("Settings", "/settings", <SettingFilled style={iconStyle} />), // Agregado: Settings
    getItem("Logout", "/logout", <LogoutOutlined style={iconStyle} />),
];


function Items() {
    const { cookies } = useAuth();
    return cookies.role === 'admin' ? items1 : items2
}

export default Items