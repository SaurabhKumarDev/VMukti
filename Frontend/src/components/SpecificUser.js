import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function SpecificUser() {
    const params = useParams();
    const navigate = useNavigate()
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        if (!params.id) {
            console.error("No user ID provided");
            return;
        }

        const fetchLoggedInUser = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/all/loginfo/${params.id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Auth-Token': localStorage.getItem("token")
                    },
                    credentials: 'include'
                });

                if (response.status === 401) {
                    // cookies.jwt = null;
                    localStorage.clear();
                    navigate('/login');
                }

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.LoggedInUser);
                    console.log(data.LoggedInUser);
                } else {
                    const errorData = await response.json();
                    console.error("Failed to fetch data:", errorData.message);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchLoggedInUser();
    }, [params.id]);

    const handleLogout = async (userId) => {
        console.log(userId);
        try {
            const response = await fetch(`http://localhost:5000/api/user/admin/logout/${userId}`, {
                method: "GET",
                headers: {
                    // 'Auth-Token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                setUserData(userData.filter(user => user._id !== userId));
                alert("User logged out successfully")
                navigate('/fetchuser')
            } else {
                const errorData = await response.json();
                console.error("Failed to log out:", errorData.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Logged-in user information</h2>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Browser</th>
                        <th scope="col">Platform</th>
                        <th scope="col">Session ID</th>
                        {/* <th scope='col'>Token</th> */}
                        <th scope="col">Status</th>
                        <th scope="col">LogIn Time</th>
                        <th scope="col">LogOut Time</th>
                        <th scope="col">LogOut</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.length > 0 ? (
                        userData.map((user, index) => (
                            <tr key={index}>
                                <td>{user.browser}</td>
                                <td>{user.platform}</td>
                                <td>{user.session_id}</td>
                                {/* <td>{user.token}</td> */}
                                <td>{user.status}</td>
                                <td>{user.login_time}</td>
                                <td>{user.logout_time ? user.logout_time : "Null"}</td>
                                {
                                    user.status === "Active" ?
                                    <td className="text-success" style={{ cursor: 'pointer' }} onClick={() => handleLogout(user._id)}>Log out</td>
                                    :
                                    <td className='text-danger'>Already logged out</td>
                                }
                                
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default SpecificUser;