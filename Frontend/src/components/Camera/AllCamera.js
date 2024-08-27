import React, { useState, useEffect } from 'react';
import '../CSS/CameraCard.css';

function AllCamera() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/camera/all/fetch`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log(responseData);
            setData(responseData.camera.camera_detail);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data.filter(item =>
        item.cameraid.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        localStorage.getItem('token') ? (
            <div>
                <div className='d-flex justify-content-between align-items-center my-5 mx-3'>
                    <h1 className='text-center my-5'>Camera Dashboard</h1>
                    <div className='input-group' style={{ width: "max-content" }}>
                        <div className="form-outline" data-mdb-input-init>
                            <input type='search' className='form-control' placeholder='Search by Camera ID...' aria-label='Search cameras by ID' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <button type="button" className="btn btn-primary" data-mdb-ripple-init>
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <div className="container">
                    {filteredData.length > 0 ? filteredData.map((item, index) => (
                        <div key={index} className="card mb-3">
                            <div className="card-header">
                                {item.cameraname} <span className={`badge ${item.islive ? '' : 'offline'}`}>{item.islive ? 'Live' : 'Offline'}</span>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{item.cameraid}</h5>
                                <p className="card-text"><strong>Customer:</strong> {item.customerid}</p>
                                <div className="list-group">
                                    <div className="list-group-item">
                                        <strong>Stream:</strong> <a href={item.cameraurl} target="_blank" rel="noopener noreferrer">View</a>
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Created:</strong> {new Date(item.createdDate).toLocaleString()}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Device:</strong> {item.deviceid}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>360°:</strong> {item.is360 ? 'Yes' : 'No'}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Full HD:</strong> {item.isfhd ? 'Yes' : 'No'}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Number Plate:</strong> {item.isnumplate ? 'Yes' : 'No'}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>PTZ:</strong> {item.isptz ? 'Yes' : 'No'}
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Plan:</strong> {item.planname} ({item.plandays} days)
                                    </div>
                                    <div className="list-group-item">
                                        <strong>Stream Name:</strong> {item.streamname.join(', ')}
                                    </div>
                                </div>
                                <a href={item.cameraurl} target="_blank" rel="noopener noreferrer" className="button">View Stream</a>
                            </div>
                        </div>
                    )) : (
                        <div>No data available</div>
                    )}
                </div>
            </div>
        ) : (
            <div>Login first then access</div>
        )
    );
}

export default AllCamera;
