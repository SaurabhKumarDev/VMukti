import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';

const CameraForm = () => {
    const params = useParams();

    const [formData, setFormData] = useState({
        cameraid: `CAM${Math.floor(Math.random() * (999 - 100 + 1)) + 100}`,
        customerid: params.customerId,
        cameraname: '',
        cameraurl: '',
        deviceid: '',
        is360: false,
        isfhd: false,
        islive: false,
        isnumplate: false,
        isptz: false,
        plandays: '',
        plandisplayname: '',
        planname: '',
        streamname: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/camera/add/${params.customerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.status !== 201) {
                if (response.message && response.error) {
                    return alert(response.error, response.message)
                } else if (response.message) {
                    return alert(response.message)
                } else if (response.error) {
                    return alert(response.error)
                }
                return alert("May be some error occure while adding the amera")
            }
            setFormData({});
            console.log(response);
            alert('Camera data submitted successfully');
        } catch (error) {
            console.error('There was an error submitting the form!', error);
        }
    };

    return (
        localStorage.getItem('token') ?
            <div className="container mt-5">
                <h2 className="text-center mb-4">Add Camera</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        {Object.keys(formData).map((key) => (
                            <div className="col-md-6 mb-3" key={key}>
                                <label htmlFor={key} className="form-label">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                {typeof formData[key] === 'boolean' ? (
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={key}
                                            name={key}
                                            checked={formData[key]}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        className="form-control"
                                        id={key}
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
            :
            <div>Login first than access this page</div>
    );
};

export default CameraForm;
