import{
    HiUserGroup,
    HiOutlineCash,
    HiOutlineViewGrid,
    HiOutlineCog,
    HiOutlineLogout,
    HiUsers,
    HiTruck,
    HiCash,
    HiShoppingCart
} from  "react-icons/hi"

import { FcSalesPerformance, FcServices } from "react-icons/fc"
import { LuListOrdered } from "react-icons/lu"

import{ MdLocalLaundryService, MdOutlineLocalLaundryService } from "react-icons/md";

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'puntoventa',
        label: 'Punto de Venta',
        path: '/menuPuntoVenta',
        icon: <FcSalesPerformance/>
    },
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: <HiOutlineViewGrid/>
    },
    {
        key: 'equipos',
        label: 'Equipos',
        path: '/equipos',
        icon: <HiTruck/>
    },
    {
        key: 'cajas',
        label: 'Cajas',
        path: '/cajas',
        icon: <HiCash/>
    },
    {
        key: 'users',
        label: 'Usuarios',
        path: '/users',
        icon: <HiUsers/>
    },
    {
        key: 'clients',
        label: 'Clientes',
        path: '/clients',
        icon: <HiShoppingCart/>
    },
    {
        key: 'services',
        label: 'Servicios',
        path: '/services',
        icon: <FcServices/>
    },
    {
        key: 'pedidos',
        label: 'Pedidos',
        path: '/pedidos',
        icon: <LuListOrdered/>
    },
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
    {
        key: 'settings',
        label: 'Configuraciones',
        path: '/settings',
        icon: <HiOutlineCog/>
    },
]