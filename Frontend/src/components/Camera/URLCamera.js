import { useEffect } from 'react';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const StreamData = () => {
    const [data, setData] = React.useState([]);

    useEffect(() => {
        const fetchDataOnline = async () => {
            try {
                // Fetch data from the API
                const response = await fetch('http://localhost:5000/api/camera/fetch/url', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const responseData = await response.json();
                setData(responseData);
                console.log(responseData);
            }
            catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchDataOnline();
    }, []);

    const renderPublisher = (publisher) => {
        if (!publisher) return <div className="card-body text-muted">No Publisher</div>;
        return (
            <div className="inner-card">
                <div className="inner-card-header">Publisher Info</div>
                <div className="inner-card-body">
                    <p><strong>App:</strong> {publisher.app}</p>
                    <p><strong>Stream:</strong> {publisher.stream}</p>
                    <p><strong>Client ID:</strong> {publisher.clientId}</p>
                    <p><strong>Connect Created:</strong> {new Date(publisher.connectCreated).toLocaleString()}</p>
                    <p><strong>Bytes:</strong> {publisher.bytes}</p>
                    <p><strong>IP:</strong> {publisher.ip}</p>
                    <div className="inner-card mt-3">
                        <div className="inner-card-header">Audio</div>
                        <div className="inner-card-body">
                            <p><strong>Codec:</strong> {publisher.audio.codec}</p>
                            <p><strong>Profile:</strong> {publisher.audio.profile}</p>
                            <p><strong>Sample Rate:</strong> {publisher.audio.samplerate}</p>
                            <p><strong>Channels:</strong> {publisher.audio.channels}</p>
                        </div>
                    </div>
                    <div className="inner-card mt-3">
                        <div className="inner-card-header">Video</div>
                        <div className="inner-card-body">
                            <p><strong>Codec:</strong> {publisher.video.codec}</p>
                            <p><strong>Width:</strong> {publisher.video.width}</p>
                            <p><strong>Height:</strong> {publisher.video.height}</p>
                            <p><strong>Profile:</strong> {publisher.video.profile}</p>
                            <p><strong>Level:</strong> {publisher.video.level}</p>
                            <p><strong>FPS:</strong> {publisher.video.fps}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSubscribers = (subscribers) => {
        if (subscribers.length === 0) return <div className="card-body text-muted">No Subscribers</div>;
        return subscribers.map((subscriber, index) => (
            <div key={index} className="inner-card mt-3">
                <div className="inner-card-header">Subscriber {index + 1}</div>
                <div className="inner-card-body">
                    <p><strong>App:</strong> {subscriber.app}</p>
                    <p><strong>Stream:</strong> {subscriber.stream}</p>
                    <p><strong>Client ID:</strong> {subscriber.clientId}</p>
                    <p><strong>Connect Created:</strong> {new Date(subscriber.connectCreated).toLocaleString()}</p>
                    <p><strong>Bytes:</strong> {subscriber.bytes}</p>
                    <p><strong>IP:</strong> {subscriber.ip}</p>
                    <p><strong>Protocol:</strong> {subscriber.protocol}</p>
                </div>
            </div>
        ));
    };

    const renderStreamData = (streamData) => {
        return Object.entries(streamData).map(([streamId, streamInfo]) => (
            <div key={streamId} className="card mb-4">
                <div className="card-header">
                    <h6 className="mb-0">Stream ID: {streamId}</h6>
                </div>
                <div className="card-body">
                    <h5>Publisher</h5>
                    {renderPublisher(streamInfo.publisher)}
                    <h5 className='mt-4'>Subscribers</h5>
                    {renderSubscribers(streamInfo.subscribers)}
                </div>
            </div>
        ));
    };

    return (
        localStorage.getItem('token') ?
            < div className="container mt-4" >
                {
                    Object.entries(data).map(([dvr, streamData]) => (
                        <div key={dvr}>
                            <h2 className="mb-4">{dvr}</h2>
                            {renderStreamData(streamData)}
                        </div>
                    ))
                }
                < footer >
                    & copy; 2024 Stream Data Viewer
                </footer >
            </div >
            :
            <div className="container mt-4">
                <h2>Please login to view Stream Data</h2>
            </div>
    );
};

export default StreamData;