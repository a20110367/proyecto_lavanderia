import { Link } from "react-router-dom";

export default function DefaultLayout() {
    return(
        <>
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/addUser">Signup</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/equipos">Equipos</Link>
                    </li>
                </ul>
            </nav>
        </header>
        </>
    );
}