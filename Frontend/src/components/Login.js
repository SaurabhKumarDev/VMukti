import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [deviceInfo, setDeviceInfo] = useState(null);
    const navigate = useNavigate();
    const [address, setAddress] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/user/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    platform: deviceInfo.deviceType,
                    browser: deviceInfo.browserName,
                    private_ip: deviceInfo.private_ip,
                    address: address
                }),
                credentials: 'include'
            });
            const data = await response.json();

            if (response.status > 400) {
                return navigate('/login');
            }

            console.log('Response:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('Session', data.session);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const getGeolocation = () => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    // Fetch the location only after setting the address
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                        const data = await response.json();
                        setAddress(`${data.address.city || 'Unknown City'}, ${data.address.country || 'Unknown Country'}`);
                    } catch (error) {
                        console.error("Error fetching location:", error.message);
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        };
        getGeolocation();
        getSystemInfo();
    }, []);

    async function getSystemInfo() {
        const userAgent = navigator.userAgent;
        const deviceType = /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";
        let browserName = getBrowserName(userAgent);
        const private_ip = await getPrivateIp();
        if (navigator.brave) {
            browserName = "Brave";
        }
        setDeviceInfo({ deviceType, browserName, private_ip });
    }

    async function getPrivateIp() {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    }

    function getBrowserName(userAgent) {
        if (userAgent.indexOf("Firefox") > -1) {
            return "Firefox";
        } else if (userAgent.indexOf("SamsungBrowser") > -1) {
            return "Samsung Internet";
        } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
            return "Opera";
        } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
            return "Edge";
        } else if (userAgent.indexOf("Vivaldi") > -1) {
            return "Vivaldi";
        } else if (userAgent.indexOf("UCBrowser") > -1) {
            return "UC Browser";
        } else if (userAgent.indexOf("Chrome") > -1) {
            return "Chrome";
        } else if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } else if (userAgent.indexOf("MSIE") > -1 || !!document.documentMode) {
            return "IE";
        }
        return "Unknown";
    }

    return (
        localStorage.getItem('token') ?
            <div>You are already logged in</div> :
            <form className='mx-5 my-5 w-50' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="inputEmail"
                        aria-describedby="emailHelp"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
    );
}

export default Login;