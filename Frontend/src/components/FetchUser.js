import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function FetchUser() {
    const [userData, setUserData] = useState([]);
    const naviagte = useNavigate()

    const fetchUserData = async () => {
        try {
            const response = await fetch('http://192.168.29.2:5000/api/user/fetch', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    // 'Auth-Token': localStorage.getItem('token')
                },
                credentials: 'include'
            });

            if (response.status === 401) {
                localStorage.clear();
                naviagte('/login');
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const users = data.Detail.Users || [];
            const admins = data.Detail.Admin || [];
            const managers = data.Detail.manager || [];

            setUserData([...users, ...admins, ...managers]);
            console.log('Response:', data);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const deleteThisUser = async (userId) => {
        try {
            const response = await fetch(`http://192.168.29.2:5000/api/user/delete/${userId}`, {
                method: "DELETE",
                headers: {
                    // 'Auth-Token': localStorage.getItem('token')
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Update the user data after deletion
            setUserData(prevData => prevData.filter(user => user._id !== userId));
            console.log('User deleted:', userId);

        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        localStorage.getItem('token') ?
            <div className="container mt-5">
                <h2 className="text-center mb-4">Fetch Users</h2>
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Role</th>
                            <th scope="col">Email Verified</th>
                            <th scope="col">Account Creation Date</th>
                            <th scope="col">Actions</th>
                            <th scope='col'>login Detail</th>
                            <th scope='col'>Camera</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.length > 0 ? (
                            userData.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.name ? user.name : "Unknown"}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.isEmailVerified ? 'Yes' : 'No'}</td>
                                    <td>{formatDate(user.accountCreationDate)}</td>
                                    <td>
                                        <i
                                            className="material-icons cursor-pointer"
                                            onClick={() => deleteThisUser(user._id)}
                                        >
                                            delete
                                        </i>
                                        <Link to={`/edituser/${user._id}`}>
                                            <i className="material-icons cursor-pointer">
                                                edit
                                            </i>
                                        </Link>
                                    </td>
                                    <td><Link to={`/specificuser/${user._id}`}>click</Link>
                                    </td>
                                    <td><Link to={`/camera/${user._id}`}>Click</Link></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            :
            <div>You have to first login to access this page</div>
    );
}

export default FetchUser;
