import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function EditUser() {
    const params = useParams();
    const userId = params.id;
    const [userData, setUserData] = useState({
    });

    const naviagte = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/user/update/${userId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    // 'Auth-Token': localStorage.getItem('token')
                },
                body: JSON.stringify(userData),
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
            console.log('User updated:', data);
            
        } catch (error) {
            console.error('Error updating user:', error);
        }
        setUserData({})
    };

    return (
        localStorage.getItem('token') ?
        <div className="container mt-5">
            <h2 className="text-center mb-4">Edit User</h2>
            <form onSubmit={handleSubmit} className='d-flex gap-3 flex-column'>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                        type="text"
                        className="form-control"
                        id="role"
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="securityQuestion">Security Question</label>
                    <input
                        type="text"
                        className="form-control"
                        id="securityQuestion"
                        name="securityQuestion"
                        value={userData.securityQuestion}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="securityAnswer">Security Answer</label>
                    <input
                        type="text"
                        className="form-control"
                        id="securityAnswer"
                        name="securityAnswer"
                        value={userData.securityAnswer}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update User</button>
            </form>
        </div>
        :
        <div>You should have to login yourself first</div>
    );
}

export default EditUser;
