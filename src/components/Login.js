import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./css/Login.css"

const Login = ({ setToken }) => {
    const [voterId, setVoterId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Clear the voterId field on component mount
        setVoterId('');
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { voter_id: voterId, password });
            setToken(response.data.token);
            navigate('/elections');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Voter ID"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    autoComplete="off"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                />
                <button type="submit">Login</button>
            </form>
            <div>
                <p>New user? <Link to="/register">Sign up here</Link></p>
            </div>
        </div>
    );
};

export default Login;
