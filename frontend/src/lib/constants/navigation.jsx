import{
    HiUserGroup,
    HiOutlineCash,
    HiOutlineViewGrid,
    HiOutlineCog,
    HiOutlineLogout
} from  "react-icons/hi"

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
        icon: <HiUserGroup/>
    },
    {
        key: 'cajas',
        label: 'Cajas',
        path: '/cajas',
        icon: <HiOutlineCash/>
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