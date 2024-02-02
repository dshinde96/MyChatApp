import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CSS/Navbar.css"
const Navbar = () => {
    const img_src = "https://th.bing.com/th/id/R.9d32bec8058bd3595a63a08a8cc12ade?rik=9cCTin36GLU%2f5w&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_87237.png&ehk=hVpH%2bC7rwlA1j2KqxGpMs1sp9l0RgM0jjRJsJsvDoPc%3d&risl=&pid=ImgRaw&r=0";
    const [user, setuser] = useState(sessionStorage.getItem('user'));
    const navigate = useNavigate();
    const logout = () => {
        sessionStorage.setItem('user', '');
        sessionStorage.setItem('authTocken', '');
        navigate('/login');
    }
    return (
        <>
            <>
                <nav class="navbar bg-dark navbar-expand-lg bg-body-tertiary sticky-top"  data-bs-theme="dark">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#" style={{ color: "white" }}>ChatApp</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <Link class="nav-link" style={{ color: "white" }} to="/">Home</Link>
                                </li>
                            </ul>
                            <div class="nav-item dropdown" style={{ color: "white" }}>
                                <a class="nav-link dropdown-toggle profile" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ display: "flex" }}>
                                    <div className="profile mx-2">
                                        <img className='profile_pic mx-2' src={img_src} style={{ height: "40px", width: "40px", backgroundColor: "white", borderRadius: "100%" }} />
                                        <h6 style={{ color: "white" }}>{user}</h6>
                                    </div>
                                </a>
                                <ul class="dropdown-menu mx-1">
                                    <li><button class="dropdown-item" onClick={logout}>Logout</button></li>
                                </ul>
                            </div>
                            <div className="notifications mx-3">
                                <NavLink to='/notifications'><i class="fa fa-bell" style={{ fontSize: "30px", color: "black" }}></i></NavLink>
                            </div>
                        </div>
                    </div>
                </nav>
            </>
        </>
    )
}

export default Navbar;