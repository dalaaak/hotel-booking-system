import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdAttachEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";
import { BiLogInCircle } from "react-icons/bi";

function Loginto() {
    const [email, setEmail ]= useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/home';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/hotel-manager/login', {
                email,
                password
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', 'hotel_manager');
                localStorage.setItem('email', email);
                localStorage.setItem('hotelId', response.data.hotelId);
                navigate('/hotel-manager/dashboard');
            } else {
                setError('Invalid login credentials');
            }
        } catch (error) {
            setError('Invalid email or password');
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label> <MdAttachEmail /> Email: </label>
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

export default Loginto;
