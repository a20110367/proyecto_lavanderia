import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard () {
    return(
        <div>
            <p>Este es el dashboard</p> <Link to="/equipos" className="Ir-equipos">Ir a equipos </Link>
            <h1>Bienvenido Herobrine</h1>
        </div>
    )
}