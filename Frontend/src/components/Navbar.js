import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const responseOfLogOut = await fetch("http://localhost:5000/api/user/logout", {
                method: 'GET',
                headers: {
                    // "Auth-token": localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Include credentials to send cookies if needed
            });

            if (!responseOfLogOut.ok) {
                throw new Error(`Logout failed with status ${responseOfLogOut.status}`);
            }
            const response = await responseOfLogOut.json();
            console.log(response);
            localStorage.clear();
            navigate('/login');
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="#">Testing</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/fetchuser">Fetch All User</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/settings">Setting</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cameradashboard">Fetch All Camera</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/loginfo">Own login details</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/url/camera">URL Camera</Link>
                        </li>
                        <li className='nav-item'>
                            <button className='nav-link btn btn-link' onClick={logout}>LogOut</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;