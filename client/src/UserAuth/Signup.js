import { useNavigate,Link } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import Nav from './AuthNav'

const Signup=()=>{
    const navigate = useNavigate();
    const [user, setuser] = useState({name:"", email: "", password: "" });
    const [errmsg,setErrmsg]=useState('');
    const [invalidcred, setinvalidcred] = useState(false);
    const handleRegistration = async () => {
        const url = `http://localhost:8000/user/signup`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        if (response.status != 200) {
            setErrmsg(data.msg)
            return setinvalidcred(true);
        }
        sessionStorage.setItem("authTocken", data.authToken);
        sessionStorage.setItem("user", data.name);
        sessionStorage.setItem("email", data.email);
        navigate('/');

    }
    const handle_change = (e) => {
        setuser({ ...user, [e.target.name]: e.target.value });
    }
    return (
        <>
        <Nav/>
            <form className="Logincnt">
                <div class="wrapper">
                    <div class="title">
                        Register
                    </div>
                    <form action="#">
                    <div class="field">
                            <input type="text" required name="name" onChange={handle_change}/>
                                <label>Your Name</label>
                        </div>
                        <div class="field">
                            <input type="text" required name="email" onChange={handle_change}/>
                                <label>Your Email</label>
                        </div>
                        <div class="field">
                            <input type="password" required name="password" onChange={handle_change}/>
                                <label>Password</label>
                        </div>
                        <div className="Invalid">
                            <p>{invalidcred?errmsg:""}</p>
                        </div>
                        <div class="field">
                            <input type="button" className="subbtn" value="REGISTER" onClick={handleRegistration}/>
                        </div>
                        <div class="signup-link">
                        Have already an account? ? <Link class="nav-link" to="/login">Login Here</Link>
                        </div>
                    </form>
                </div>
            </form>
        </>
    )
}

export default Signup;