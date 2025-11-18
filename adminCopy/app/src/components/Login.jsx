import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";
import './login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const fetchUserRole = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await axios.get("http://127.0.0.1:8000/user/api/user-role/", {
            headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.setItem("user_role", response.data.user_type);
    } catch (error) {
        console.error("❌ Error fetching user role:", error);
    }
};


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/user/api/login/', {
                email,
                password
            });

            console.log(response.data); // عرض الرد في الكونسول للتأكد

            if (response.data && response.data.redirect_url) {
                console.log("🔹 Received Token:", response.data.token); // طباعة التوكن في Console
                localStorage.setItem('token', response.data.token); // حفظ التوكن
                await fetchUserRole();
                navigate(response.data.redirect_url); // إعادة التوجيه
            } else {
                setError('Invalid login credentials');
            }
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            setError(error.response?.data?.error || 'An unexpected error occurred.');
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label> <FaUserEdit /> Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label> <RiLockPasswordFill /> Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
                        <p className="register-link">
                Don't have an account? <a href="/create-account"> Create Account </a>
            </p>
        </div>
    );
}

export default Login;
