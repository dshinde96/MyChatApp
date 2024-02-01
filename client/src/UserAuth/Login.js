import { useContext, useState } from "react"
import { useNavigate,Link } from "react-router-dom";
import "./Login.css";
import Nav from './AuthNav';

const Login = () => {
    const navigate = useNavigate();
    const [user, setuser] = useState({ email: "", password: "" });
    const [errmsg,setErrmsg]=useState('');
    const [invalidcred, setinvalidcred] = useState(false);
    const handleLogin = async () => {
        const url = `http://localhost:8000/user/login`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        console.log(data);
        if (response.status != 200) {
            setErrmsg(data.msg);
            setinvalidcred(true);
            return;
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
            <div className="Logincnt">
                <div class="wrapper">
                    <div class="title">
                        Login Form
                    </div>
                    <form action="#">
                        <div class="field">
                            <input type="text" required name="email" onChange={handle_change}/>
                                <label>Email Address</label>
                        </div>
                        <div class="field">
                            <input type="password" required name="password" onChange={handle_change}/>
                                <label>Password</label>
                        </div>
                        <div className="Invalid">
                            <p>{invalidcred?errmsg:""}</p>
                        </div>
                        <div class="field">
                            <input type="button" className="subbtn" value="Login" onClick={handleLogin}/>
                        </div>
                        <div class="signup-link">
                            Not a member? <Link class="nav-link" to="/signup">Rgister Here</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
};
export default Login;