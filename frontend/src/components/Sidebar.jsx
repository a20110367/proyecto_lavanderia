import React from 'react'
import "./Sidebar.css"
import { FcFullTrash } from 'react-icons/fc'
import { DASHBOARD_SIDEBAR_LINKS } from '../lib/consts/navigation'
import { Link } from 'react-router-dom'

const linkClasses =
	'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'

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
        <div>bottom part</div>
    </div>
  )
}

function SidebarLink ({item}) {
    return(
        <Link to={item.path} className='Links'>
            <span className='ItemLogo text-xl'>{item.icon}</span>
            {item.label}
        </Link>
    )
}
