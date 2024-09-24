import React from "react";
import {
  MdLocalLaundryService,
  MdIron,
  MdOutlineLocalLaundryService,
} from "react-icons/md";
import { FcEngineering } from "react-icons/fc";
import { LuPackageSearch } from "react-icons/lu";
import { LuListOrdered } from "react-icons/lu";
import { GiHandTruck } from "react-icons/gi";
import { SettingFilled, LogoutOutlined } from "@ant-design/icons";
import { HiUsers, HiTruck, HiCash, HiShoppingCart } from "react-icons/hi";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { RiHandCoinFill } from "react-icons/ri";
import { useAuth } from "../../hooks/auth/auth";
import { TbWashGentle } from "react-icons/tb";
import { PiShirtFoldedDuotone } from "react-icons/pi";
import { BsBasketFill } from "react-icons/bs";

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
    "Autoservicio",
    "/autoServicio",
    <MdLocalLaundryService style={iconStyle} />
  ),
  getItem(
    "Productos",
    "/recepcionProductos",
    <BsBasketFill style={iconStyle} />
  ),

  getItem(
    "Encargo Ropa",
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
    <PiShirtFoldedDuotone style={iconStyle} />,
    [
      getItem("Recepcion", "/recepcionTintoreria"),
      getItem("Entrega", "/entregaTintoreria"),
    ]
  ),

  getItem(
    "Encargo Varios",
    "/encargoVarios",
    <TbWashGentle style={iconStyle} />,
    [
      getItem("Recepcion", "/recepcionVarios"),
      getItem("Entrega", "/entregaVarios"),
    ]
  ),

  getItem("Pedidos", "/pedidos", <LuListOrdered style={iconStyle} />, [
    getItem("Encargo Ropa", "/pedidosLavanderia"),
    getItem("Autoservicio", "/pedidosAutoservicio"),
    getItem("Planchado", "/pedidosPlanchado"),
    getItem("Tintoreria", "/pedidosTintoreria"),
    getItem("Encargo Varios", "/pedidosVarios"),
    getItem("Pedidos Finalizados", "/pedidosGeneral"),

    getItem("Almacenados", "/pedidosAlmacenados"),
  ]),

  getItem(
    "Encontrar Pedido",
    "/buscarPedidos",
    <LuPackageSearch style={iconStyle} />
  ),
  getItem("Clientes", "/clients", <HiShoppingCart style={iconStyle} />),

  getItem("Caja", "/cajas", <HiCash style={iconStyle} />, [
    getItem("Inicio de caja", "/inicioCaja"),
    getItem("Corte de caja", "/corteCaja"),
    getItem("Pedidos Pagados", "/cajaPedidos"),
    getItem(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ lineHeight: 1 }}>Historial de cortes</span>
        <span style={{ lineHeight: 1 }}>Servicios</span>
      </div>,
      "/historialCaja"
    ),
    getItem(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ lineHeight: 1 }}>Historial de cortes</span>
        <span style={{ lineHeight: 1 }}>Productos</span>
      </div>,
      "/historialCajaProductos"
    ),
    getItem(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ lineHeight: 1 }}>Historial de cortes</span>
        <span style={{ lineHeight: 1 }}>Planchado</span>
      </div>,
      "/historialCajaPlanchado"
    ),
    getItem("Retiro de caja", "/retiro"),
  ]),

  getItem("Equipos", "/", <HiWrenchScrewdriver style={iconStyle} />, [
    getItem("Activar Equipos", "/activarEquipos"),
    getItem(<div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ lineHeight: 1 }}>Administrar</span>
      <span style={{ lineHeight: 1 }}>Equipos</span>
    </div>, "/equipos"),
    getItem(<div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ lineHeight: 1 }}>Administrar</span>
      <span style={{ lineHeight: 1 }}>Planchas</span>
    </div>, "/planchas"),
  ]),


  getItem("Usuarios", "/users", <HiUsers style={iconStyle} />),

  getItem("Servicios", "/services", <RiHandCoinFill style={iconStyle} />, [
    getItem("Encargo Ropa", "/servicesLavanderia"),
    getItem("Planchado", "/servicesPlanchado"),
    getItem("Autoservicio", "/servicesAutoservicio"),
    getItem("Tintoreria", "/servicesTintoreria"),
    getItem("Encargo Varios", "/servicesVarios"),
    getItem("Productos", "/productos"),
  ]),

  getItem("Administración", "/administracion", <HiCash style={iconStyle} />, [
    getItem("Reportes", "/reportes"),
    // getItem("Reportes Productos", "/reportesProductos"),
    getItem(<div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ lineHeight: 1 }}>Cancelación de</span>
      <span style={{ lineHeight: 1 }}>Servicios</span>
    </div>, "/cancelacion"),
    getItem(<div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ lineHeight: 1 }}>Historial de</span>
      <span style={{ lineHeight: 1 }}>Cancelaciones</span>
    </div>, "/historialOrdenesCanceladas"),
    getItem("Reembolsos", "/reembolso"),
    getItem("Caja Chica", "/cajaChica"),
  ]),

  { type: "divider", style: { margin: "140px " } },

  // getItem("Configuración", "/settings", <SettingFilled style={iconStyle} />),
  getItem("Cerrar Sesión", "/logout", <LogoutOutlined style={iconStyle} />),
];

const items2 = [
  getItem(
    "Lavanderia",
    "/autoServicio",
    <MdLocalLaundryService style={iconStyle} />
  ),
  getItem(
    "Productos",
    "/recepcionProductos",
    <BsBasketFill style={iconStyle} />
  ),

  getItem(
    "Encargo Ropa",
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
    <PiShirtFoldedDuotone style={iconStyle} />,
    [
      getItem("Recepcion", "/recepcionTintoreria"),
      getItem("Entrega", "/entregaTintoreria"),
    ]
  ),

  getItem(
    "Encargo Varios",
    "/encargoVarios",
    <TbWashGentle style={iconStyle} />,
    [
      getItem("Recepcion", "/recepcionVarios"),
      getItem("Entrega", "/entregaVarios"),
    ]
  ),

  getItem("Pedidos", "/pedidos", <LuListOrdered style={iconStyle} />, [
    getItem("Encargo Ropa", "/pedidosLavanderia"),
    getItem("Autoservicio", "/pedidosAutoservicio"),
    getItem("Planchado", "/pedidosPlanchado"),
    getItem("Tintoreria", "/pedidosTintoreria"),
    getItem("Encargo Varios", "/pedidosVarios"),
    getItem("Peidos Finalizados", "/pedidosGeneral"),
    getItem("Almacenados", "/pedidosAlmacenados"),
  ]),
  getItem(
    "Encontrar Pedido",
    "/buscarPedidos",
    <LuPackageSearch style={iconStyle} />
  ),

  getItem(
    "Añadir Clientes",
    "/addClient",
    <HiShoppingCart style={iconStyle} />
  ),

  getItem("Caja", "/cajas", <HiCash style={iconStyle} />, [
    getItem("Iniciar caja", "/inicioCaja"),
    getItem("Corte de caja", "/corteCaja"),
    getItem("Pedidos Pagados", "/cajaPedidos"),
    getItem(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ lineHeight: 1 }}>Historial de cortes</span>
        <span style={{ lineHeight: 1 }}>Servicios</span>
      </div>,
      "/historialCaja"
    ),
    getItem(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ lineHeight: 1 }}>Historial de cortes</span>
        <span style={{ lineHeight: 1 }}>Productos</span>
      </div>,
      "/historialCajaProductos"
    ),
    getItem(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ lineHeight: 1 }}>Historial de cortes</span>
        <span style={{ lineHeight: 1 }}>Planchado</span>
      </div>,
      "/historialCajaPlanchado"
    ),
    getItem("Retiro de caja", "/retiro"),
  ]),

  getItem("Equipos", "/", <HiWrenchScrewdriver style={iconStyle} />, [
    getItem("Activar Equipos", "/activarEquipos"),
    getItem(<div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ lineHeight: 1 }}>Administrar</span>
      <span style={{ lineHeight: 1 }}>Equipos</span>
    </div>, "/equipos"),
    getItem(<div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ lineHeight: 1 }}>Administrar</span>
      <span style={{ lineHeight: 1 }}>Planchas</span>
    </div>, "/planchas"),
  ]),

  getItem("Servicios", "/services", <RiHandCoinFill style={iconStyle} />, [
    getItem("Encargo Ropa", "/servicesLavanderia"),
    getItem("Planchado", "/servicesPlanchado"),
    getItem("Autoservicio", "/servicesAutoservicio"),
    getItem("Tintoreria", "/servicesTintoreria"),
    getItem("Encargo Varios", "/servicesVarios"),
    getItem("Productos", "/productos"),
  ]),

  getItem("Administración", "/administracion", <HiCash style={iconStyle} />, [
    getItem("Reportes", "/reportes"),
    // getItem("Reportes Productos", "/reportesProductos"),
    getItem(<div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ lineHeight: 1 }}>Cancelación de</span>
      <span style={{ lineHeight: 1 }}>Servicios</span>
    </div>, "/cancelacion"),
    getItem(<div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ lineHeight: 1 }}>Historial de</span>
      <span style={{ lineHeight: 1 }}>Cancelaciones</span>
    </div>, "/historialOrdenesCanceladas"),
    getItem("Reembolsos", "/reembolso"),
    getItem("Caja Chica", "/cajaChica"),
  ]),

  { type: "divider", style: { margin: "140px " } },

  getItem("Cerrar Sesión", "/logout", <LogoutOutlined style={iconStyle} />),
];

function Items() {
  const { cookies } = useAuth();
  return cookies.role === "admin" ? items1 : items2;
}

export default Items;
