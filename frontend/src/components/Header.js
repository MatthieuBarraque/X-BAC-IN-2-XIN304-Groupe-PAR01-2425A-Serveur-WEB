import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleDashboardClick = () => {
        if (!token) {
            navigate('/login');
        } else {
            navigate('/profile');
        }
    };

    return (
        <header className="header">
            <div className="left-nav">
                <Link to="/" className="logo">Server-Web</Link>
                <Link to="/">Home</Link>
            </div>
            <nav className="right-nav">
                <Link to="/profile" onClick={handleDashboardClick}>Mon Dashboard</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
            </nav>
        </header>
    );
}

export default Header;
