import Navbar from "../routes/Navbar"

function Dashboard(user) {
    console.log(user);
    return(
    <>
        <Navbar></Navbar>
        <p>Dash</p>
    </>
    );
}

export default Dashboard
