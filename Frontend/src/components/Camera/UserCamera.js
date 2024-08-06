import React, { useState, useEffect } from 'react';
import '../CSS/CameraCard.css';
import { Link, useParams } from 'react-router-dom';

function UserCamera() {
    const [data, setData] = useState([]);
    const params = useParams();

    const fetchData = async () => {
        try {
            const response = await fetch(`http://192.168.29.2:5000/api/camera/all/fetch/${params.userId}`, {
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
            setData(responseData.camera);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        if (params.userId) {
            fetchData();
        }
    }, [params.userId]);

    if (!params.userId) {
        return <div>Loading...</div>;
    }
    return (
        localStorage.getItem('token') ? (
            <div>
                <h1 className='text-center my-5'>Camera Dashboard</h1>
                <Link to={`/camera/add/${params.userId}`} className="btn btn-primary" style={{marginLeft:"12px"}}>Add Camera</Link>
                <div className="container">
                    {data.length > 0 ? data.map((item, index) => (
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

export default UserCamera;
