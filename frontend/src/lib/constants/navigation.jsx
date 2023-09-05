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

import{ MdLocalLaundryService, MdOutlineLocalLaundryService } from "react-icons/md";

export const DASHBOARD_SIDEBAR_LINKS = [
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
        key: 'lavados',
        label: 'Lavado',
        path: '/lavados',
        icon: <MdLocalLaundryService/>
    },
    {
        key: 'planchados',
        label: 'Planchado',
        path: '/planchados',
        icon: <MdOutlineLocalLaundryService/>
    },
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
    {
        key: 'settings',
        label: 'Configuraciones',
        path: '/settings',
        icon: <HiOutlineCog/>
    },
    {
        key: 'logout',
        label: 'Cerrar Sesion',
        path: '/login',
        icon: <HiOutlineLogout/>

    }
]