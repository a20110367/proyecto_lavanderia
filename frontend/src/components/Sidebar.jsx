import React from 'react'
import "./Sidebar.css"
import { FcFullTrash } from 'react-icons/fc'
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from '../lib/consts/navigation'
import { Link, useLocation } from 'react-router-dom'



export default function Sidebar() {
  return ( 
    <div className='Contenedor'>
        <div className='Icono'> 
            <FcFullTrash fontSize={24}/> 
            <span className="Logo">Laundry System</span>
        </div>
        <div className='Top'>
            {DASHBOARD_SIDEBAR_LINKS.map((item) =>(
                <SidebarLink key={item.key} item={item} />
            ))}
        </div>
        <div className='Bottom'>
            {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) =>(
                <SidebarLink key={item.key} item={item}/>
            ))}
        </div>
    </div>
  )
}

function SidebarLink ({item}) {

    const {pathname} = useLocation()

    return(
        <Link to={item.path} className='Links'>
            <span className='ItemLogo text-xl'>{item.icon}</span>
            {item.label}
        </Link>
    )
}
