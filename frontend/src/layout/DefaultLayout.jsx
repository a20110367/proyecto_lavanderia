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
                        <Link to="/signup">Signup</Link>
                    </li>
                </ul>
            </nav>
        </header>
        </>
    );
}