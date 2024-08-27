import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/SettingsPage.css';

const Setting = () => {

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        // Perform account deletion logic here
        const responseOfDelete = await fetch("http://localhost:5000/api/user/delete", {
            method: 'DELETE',
            headers: {
                // "Auth-token": localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            credentials: 'include' // This is important to include cookies in the request
        });
        const response = await responseOfDelete.json();

        console.log('Account deleted', response);
        setShowModal(false); // Close the modal after deletion
        navigate('/login');
    };

    return (
        localStorage.getItem('token') ?
            <div className="settings-container">
                <h2 className="settings-title">Account Settings</h2>
                <button className="delete-btn" onClick={() => setShowModal(true)}>
                    Delete Your Account
                </button>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3 className="modal-title">Confirm Account Deletion</h3>
                            <p className="modal-body">
                                Are you sure you want to delete your account? This action cannot be undone.
                            </p>
                            <div className="modal-buttons">
                                <button className="modal-btn cancel-btn" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button className="modal-btn delete-btn" onClick={handleDeleteAccount}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            :
            <div>You have to login yourself first then try again to delete your account</div>
    );
};

export default Setting;