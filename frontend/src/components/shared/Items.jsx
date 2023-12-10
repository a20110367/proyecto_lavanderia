import React from 'react'
import {
    MdLocalLaundryService,
    MdIron,
    MdOutlineLocalLaundryService
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
import { TbWashGentle } from "react-icons/tb";
import { PiShirtFoldedDuotone } from "react-icons/pi";

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
    getItem("Autoservicio", "/autoServicio",  <MdLocalLaundryService style={iconStyle} />),
    
    getItem(
        "Encargo",
        "/Encargo",
        <MdOutlineLocalLaundryService style={iconStyle} />,
        [
            getItem("Recepcion", "/recepcionLavanderia"),
            getItem("Entrega", "/entregaLavanderia"),

        ]
    ),

    getItem("Planchado", "/planchadoIron", <MdIron style={iconStyle} />, [
        getItem("Recepcion", "/recepcionPlanchado"),
        getItem("Entrega", "/entregaPlanchado"),
    ]),

    getItem(
        "Tintoreria",
        "/Tintoreria",
        <PiShirtFoldedDuotone    style={iconStyle} />,
        [
            getItem("Recepcion", "/recepcionTintoreria"),
            getItem("Entrega", "/entregaTintoreria"),

        ]
    ),

    getItem("Encargo Varios", "/encargoVarios", <TbWashGentle  style={iconStyle} />, [
        getItem("Recepcion", "/recepcionVarios"),
        getItem("Entrega", "/entregaVarios"),
    ]),


    getItem("Pedidos", "/pedidos", <LuListOrdered style={iconStyle} />, [
        getItem("Encargo Ropa", "/pedidosLavanderia"),
        getItem("Autoservicio", "/pedidosAutoservicio"),
        getItem("Planchado", "/pedidosPlanchado"),
        getItem("Tintoreria", "/pedidosTintoreria"),
        getItem("Encargo Varios", "/pedidosVarios"),
        getItem("General", "/pedidosGeneral"),
    ]),
    getItem("Clientes", "/clients", <HiShoppingCart style={iconStyle} />),

    getItem("Caja", "/cajas", <HiCash style={iconStyle} />, [
        getItem("Inicio de caja", "/inicioCaja"),
        getItem("Corte de caja", "/corteCaja"),
        getItem("Pedidos", "/cajaPedidos"),
        getItem("Historial de cortes", "/historialCaja"),
        getItem("Retiro de caja", "/retiro"),
        getItem("Reembolsos", "/reembolso"),
        getItem("Caja Chica", "/cajaChica"),        
    ]),
    getItem("Equipos", "", <HiWrenchScrewdriver style={iconStyle} />, [
        getItem("Activar Equipos", "/activarEquipos"),
        getItem("Administrar Equipos", "/equipos"),
        getItem("Administrar Planchas", "/planchas"),
    ]),

    getItem("Usuarios", "/users", <HiUsers style={iconStyle} />),
    
    getItem("Servicios", "/services", <RiHandCoinFill style={iconStyle} />,[
        getItem("Encargo Ropa", "/servicesLavanderia"),
        getItem("Planchado", "/servicesPlanchado"),
        getItem("Autoservicio", "/servicesAutoservicio"),
        getItem("Tintoreria", "/servicesTintoreria"),
        getItem("Encargo Varios", "/servicesVarios"),

    ]),
    { type: "divider", style: { margin: "140px " } },

    getItem("Configuración", "/settings", <SettingFilled style={iconStyle} />), 
    getItem("Cerrar Sesión", "/logout", <LogoutOutlined style={iconStyle} />),
];

const items2 = [
    getItem("Lavanderia", "/autoServicio",  <MdLocalLaundryService style={iconStyle} />),

    getItem(
        "Encargo",
        "/Encargo",
        <MdOutlineLocalLaundryService style={iconStyle} />,
        [
            getItem("Recepcion", "/recepcionLavanderia"),
            getItem("Entrega", "/entregaLavanderia"),

        ]
    ),

    getItem("Planchado", "/planchadoIron", <MdIron style={iconStyle} />, [
        getItem("Recepcion", "/recepcionPlanchado"),
        getItem("Entrega", "/entregaPlanchado"),
    ]),

    
    getItem(
        "Tintoreria",
        "/Tintoreria",
        <PiShirtFoldedDuotone    style={iconStyle} />,
        [
            getItem("Recepcion", "/recepcionTintoreria"),
            getItem("Entrega", "/entregaTintoreria"),

        ]
    ),

    getItem("Encargo Varios", "/encargoVarios", <TbWashGentle  style={iconStyle} />, [
        getItem("Recepcion", "/recepcionVarios"),
        getItem("Entrega", "/entregaVarios"),
    ]),

    getItem("Pedidos", "/pedidos", <LuListOrdered style={iconStyle} />, [
        getItem("Encargo Ropa", "/pedidosLavanderia"),
        getItem("Autoservicio", "/pedidosAutoservicio"),
        getItem("Planchado", "/pedidosPlanchado"),
        getItem("Tintoreria", "/pedidosTintoreria"),
        getItem("Encargo Varios", "/pedidosVarios"),
        getItem("General", "/pedidosGeneral"),

    ]),
    getItem("Añadir Clientes", "/addClient", <HiShoppingCart style={iconStyle} />),
    
    getItem("Caja", "/cajas", <HiCash style={iconStyle} />, [
        getItem("Iniciar caja", "/inicioCaja"),
        getItem("Corte de caja", "/corteCaja"),
        getItem("Pedidos", "/cajaPedidos"),
        getItem("Historial de cortes", "/historialCaja"),
        getItem("Retiro de caja", "/retiro"),
        getItem("Reembolsos", "/reembolso"),
        getItem("Caja Chica", "/cajaChica"),        
    ]),
        
    getItem("Equipos", "/equipos", <HiWrenchScrewdriver style={iconStyle} />, [
        getItem("Activar Equipos", "/activarEquipos"),
        getItem("Administrar Equipos", "/equipos"),
        getItem("Administrar Planchas", "/planchas"),
    ]),

    getItem("Servicios", "/services", <RiHandCoinFill style={iconStyle} />,[
        getItem("Encargo Ropa", "/servicesLavanderia"),
        getItem("Planchado", "/servicesPlanchado"),
        getItem("Autoservicio", "/servicesAutoservicio"),
        getItem("Tintoreria", "/servicesTintoreria"),
        getItem("Encargo Varios", "/servicesVarios"),

    ]),

    { type: "divider", style: { margin: "140px " } },

    getItem("Cerrar Sesión", "/logout", <LogoutOutlined style={iconStyle} />),
];


function Items() {
    const { cookies } = useAuth();
    return cookies.role === 'admin' ? items1 : items2
}

export default Items