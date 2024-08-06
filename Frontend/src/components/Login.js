import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getSystemInfo();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://192.168.29.2:5000/api/user/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, platform: deviceInfo.deviceType, browser: deviceInfo.browserName }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.status >  400){
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

    function getSystemInfo() {
        const userAgent = navigator.userAgent;
        let deviceType = /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";
        let browserName = getBrowserName(userAgent);
        if (navigator.brave) {
            browserName = "Brave";
        }
        setDeviceInfo({ deviceType, browserName });
        console.log(deviceInfo);
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

    useEffect(() => {
        const ws = new WebSocket('ws://192.168.29.2:5000');

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
            const updatedStatus = JSON.parse(event.data);
            console.log('WebSocket Message Received:', updatedStatus.message);
            setStatus(updatedStatus);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        localStorage.getItem('token') ? 
        <div>You are already logged in</div> : 
        <div>
            <p>{status.message}</p>
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
        </div>
    );
}

export default Login;














































// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';


// function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [deviceInfo, setDeviceInfo] = useState(null);

//     const navigate = useNavigate()
//     useEffect(() => {
//         getSystemInfo();
//     }, []);

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const response = await fetch('http://192.168.29.2:5000/api/user/login', {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ email, password, platform: deviceInfo.deviceType, browser: deviceInfo.browserName })
//             });
//             const data = await response.json();
//             if (response.status >  400){
//                 return navigate('/login')
//             }
//             console.log('Response:', data);
//             localStorage.setItem('token',data.token)
//             localStorage.setItem('Session',data.session)
//             navigate('/dashboard')
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     function getSystemInfo() {
//         const userAgent = navigator.userAgent;
//         let deviceType = /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";
//         let browserName = getBrowserName(userAgent);
//         if (navigator.brave) {
//             browserName = "Brave";
//         }
//         setDeviceInfo({ deviceType, browserName });
//         console.log(deviceInfo);
//     }

//     function getBrowserName(userAgent) {
//         if (userAgent.indexOf("Firefox") > -1) {
//             return "Firefox";
//         } else if (userAgent.indexOf("SamsungBrowser") > -1) {
//             return "Samsung Internet";
//         } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
//             return "Opera";
//         } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
//             return "Edge";
//         } else if (userAgent.indexOf("Vivaldi") > -1) {
//             return "Vivaldi";
//         } else if (userAgent.indexOf("UCBrowser") > -1) {
//             return "UC Browser";
//         } else if (userAgent.indexOf("Chrome") > -1) {
//             return "Chrome";
//         } else if (userAgent.indexOf("Safari") > -1) {
//             return "Safari";
//         } else if (userAgent.indexOf("MSIE") > -1 || !!document.documentMode) {
//             return "IE";
//         }
//         return "Unknown";
//     }


//     const [status, setStatus] = useState('');

//     // useEffect(() => {
//     //     const ws = new WebSocket('ws://192.168.29.2:8080');

//     //     ws.onopen = () => {
//     //         console.log('WebSocket connection opened');
//     //     };

//     //     ws.onmessage = (event) => {
//     //         const updatedStatus = JSON.parse(event.data);
//     //         if (updatedStatus.length > 0) {
//     //             setStatus(updatedStatus[0].isCameraWork);
//     //         }
//     //     };

//     //     ws.onclose = () => {
//     //         console.log('WebSocket connection closed');
//     //     };

//     //     return () => {
//     //         ws.close();
//     //     };
//     // }, []);

//     useEffect(() => {
//         const ws = new WebSocket('ws://192.168.29.2:5000');

//         ws.onopen = () => {
//             console.log('WebSocket connection opened');
//         };

//         ws.onmessage = (event) => {
//             const updatedStatus = JSON.parse(event.data);
//             console.log('WebSocket Message Received:', updatedStatus.message);
//             setStatus(updatedStatus);
//         };

//         ws.onclose = () => {
//             console.log('WebSocket connection closed');
//         };

//         return () => {
//             ws.close();
//         };
//     }, []);

//     return (
//         {localStorage.getItem('token') ? 
//         <div>
//             <p>{status.message}</p>
//         <form className='mx-5 my-5 w-50' onSubmit={handleSubmit}>
//             <div className="mb-3">
//                 <label htmlFor="inputEmail" className="form-label">Email address</label>
//                 <input
//                     type="email"
//                     className="form-control"
//                     id="inputEmail"
//                     aria-describedby="emailHelp"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
//             </div>
//             <div className="mb-3">
//                 <label htmlFor="inputPassword" className="form-label">Password</label>
//                 <input
//                     type="password"
//                     className="form-control"
//                     id="inputPassword"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//             </div>
//             <button type="submit" className="btn btn-primary">Submit</button>
//         </form>
//         </div> :
//         <div>You are already logged in</div>
//         }
//     );
// }

// export default Login;




// import React, { useState } from 'react';

// function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [deviceInfo, setLoginInfo] = useState(null);

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const response = await fetch('http://192.168.29.2:5000/api/user/login', {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ email, password,  })
//             });
//             const data = await response.json();
//             console.log('Response:', data);
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };


//     function getSystemInfo() {
//         const userAgent = navigator.userAgent;
//         let deviceType = "Desktop";
//         if (/Mobi|Android/i.test(userAgent)) {
//             deviceType = "Mobile";
//         }
//         let browserName = getBrowserName(userAgent);
//         if (navigator.brave) {
//             browserName = "Brave"
//         }
//         setLoginInfo({ deviceType, browserName })
//         return { deviceType, browserName };
//     }
//     getSystemInfo()

//     function getBrowserName(userAgent) {
//         if (userAgent.indexOf("Firefox") > -1) {
//             return "Firefox";
//         } else if (userAgent.indexOf("Chrome") > -1) {
//             return "Chrome";
//         } else if (userAgent.indexOf("Safari") > -1) {
//             return "Safari";
//         } else if (userAgent.indexOf("MSIE") > -1 || !!document.documentMode) {
//             return "IE";
//         }
//         return "Unknown";
//     }
    
//     return (
//         <form className='mx-5 my-5 w-50' onSubmit={handleSubmit}>
//             <div className="mb-3">
//                 <label htmlFor="inputEmail" className="form-label">Email address</label>
//                 <input
//                     type="email"
//                     className="form-control"
//                     id="inputEmail"
//                     aria-describedby="emailHelp"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
//             </div>
//             <div className="mb-3">
//                 <label htmlFor="inputPassword" className="form-label">Password</label>
//                 <input
//                     type="password"
//                     className="form-control"
//                     id="inputPassword"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//             </div>
//             <button type="submit" className="btn btn-primary">Submit</button>
//         </form>
//     );
// }

// export default Login;




// import React, { useState, useEffect } from 'react';

// function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loginInfo, setLoginInfo] = useState(null);

//     useEffect(() => {
//         // Function to get system information
//         function getSystemInfo() {
//             const userAgent = navigator.userAgent;
//             let deviceType = /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";
//             let browserName = getBrowserName(userAgent);
//             if (navigator.brave) {
//                 browserName = "Brave";
//             }
//             setLoginInfo({ deviceType, browserName });
//             console.log(loginInfo);
//         }

//         // Function to get browser name
//         function getBrowserName(userAgent) {
//             if (userAgent.indexOf("Firefox") > -1) {
//                 return "Firefox";
//             } else if (userAgent.indexOf("Chrome") > -1) {
//                 return "Chrome";
//             } else if (userAgent.indexOf("Safari") > -1) {
//                 return "Safari";
//             } else if (userAgent.indexOf("MSIE") > -1 || !!document.documentMode) {
//                 return "IE";
//             }
//             return "Unknown";
//         }

//         getSystemInfo();
//     }, []);

//     // Function to get private IP address
//     async function getPrivateIP() {
//         return new Promise((resolve, reject) => {
//             const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
//             if (!RTCPeerConnection) {
//                 return reject(new Error('WebRTC is not supported by your browser.'));
//             }
    
//             const rtc = new RTCPeerConnection({ iceServers: [] });
//             const addrs = Object.create(null);
//             addrs['0.0.0.0'] = false;
    
//             function grepSDP(sdp) {
//                 const hosts = [];
//                 sdp.split('\r\n').forEach((line) => {
//                     if (~line.indexOf('candidate')) {
//                         const parts = line.split(' ');
//                         const addr = parts[4];
//                         const type = parts[7];
//                         if (type === 'host' && isIPv4(addr)) {
//                             hosts.push(addr);
//                         }
//                     }
//                 });
//                 return hosts;
//             }
    
//             function isIPv4(address) {
//                 const segments = address.split('.');
//                 return segments.length === 4 && segments.every(segment => {
//                     return parseInt(segment, 10) >= 0 && parseInt(segment, 10) <= 255;
//                 });
//             }
    
//             rtc.createDataChannel('');
//             rtc.createOffer((offer) => {
//                 rtc.setLocalDescription(offer);
//             }, (error) => {
//                 reject(error);
//             });
    
//             rtc.onicecandidate = (ice) => {
//                 if (ice && ice.candidate && ice.candidate.candidate) {
//                     const addr = grepSDP(ice.candidate.candidate);
//                     addr.forEach((address) => {
//                         if (!addrs[address]) {
//                             addrs[address] = true;
//                             resolve(address);
//                         }
//                     });
//                 }
//             };
//         });
//     }
    

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const privateIP = await getPrivateIP();
//             console.log(`Private IP ${privateIP}`);
//             const response = await fetch('http://192.168.29.2:5000/api/user/login', {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ email, password, ...loginInfo, privateIP })
//             });
//             const data = await response.json();
//             console.log('Response:', data);
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <form className='mx-5 my-5 w-50' onSubmit={handleSubmit}>
//             <div className="mb-3">
//                 <label htmlFor="inputEmail" className="form-label">Email address</label>
//                 <input
//                     type="email"
//                     className="form-control"
//                     id="inputEmail"
//                     aria-describedby="emailHelp"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
//             </div>
//             <div className="mb-3">
//                 <label htmlFor="inputPassword" className="form-label">Password</label>
//                 <input
//                     type="password"
//                     className="form-control"
//                     id="inputPassword"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//             </div>
//             <button type="submit" className="btn btn-primary">Submit</button>
//         </form>
//     );
// }

// export default Login;




// import React, { useState, useEffect } from 'react';

// function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loginInfo, setLoginInfo] = useState(null);

//     useEffect(() => {
//         // Function to get system information
//         function getSystemInfo() {
//             const userAgent = navigator.userAgent;
//             let deviceType = /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";
//             let browserName = getBrowserName(userAgent);
//             if (navigator.brave) {
//                 browserName = "Brave";
//             }
//             setLoginInfo({ deviceType, browserName });
//             console.log(loginInfo);
//         }

//         // Function to get browser name
//         function getBrowserName(userAgent) {
//             if (userAgent.indexOf("Firefox") > -1) {
//                 return "Firefox";
//             } else if (userAgent.indexOf("Chrome") > -1) {
//                 return "Chrome";
//             } else if (userAgent.indexOf("Safari") > -1) {
//                 return "Safari";
//             } else if (userAgent.indexOf("MSIE") > -1 || !!document.documentMode) {
//                 return "IE";
//             }
//             return "Unknown";
//         }

//         getSystemInfo();
//     }, []);

//     // Function to get private IP address
//     async function getPrivateIP() {
//         return new Promise((resolve, reject) => {
//             const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
//             if (!RTCPeerConnection) {
//                 return reject(new Error('WebRTC is not supported by your browser.'));
//             }

//             const rtc = new RTCPeerConnection({ iceServers: [] });
//             const addrs = Object.create(null);
//             addrs['0.0.0.0'] = false;

//             function grepSDP(sdp) {
//                 const hosts = [];
//                 sdp.split('\r\n').forEach((line) => {
//                     if (~line.indexOf('candidate')) {
//                         const parts = line.split(' ');
//                         const addr = parts[4];
//                         const type = parts[7];
//                         if (type === 'host' && isIPv4(addr)) {
//                             hosts.push(addr);
//                         }
//                     }
//                 });
//                 return hosts;
//             }

//             function isIPv4(address) {
//                 const segments = address.split('.');
//                 return segments.length === 4 && segments.every(segment => {
//                     return parseInt(segment, 10) >= 0 && parseInt(segment, 10) <= 255;
//                 });
//             }

//             rtc.createDataChannel('');
//             rtc.createOffer((offer) => {
//                 rtc.setLocalDescription(offer);
//             }, (error) => {
//                 reject(error);
//             });

//             rtc.onicecandidate = (ice) => {
//                 if (ice && ice.candidate && ice.candidate.candidate) {
//                     const addr = grepSDP(ice.candidate.candidate);
//                     addr.forEach((address) => {
//                         if (!addrs[address]) {
//                             addrs[address] = true;
//                             resolve(address);
//                         }
//                     });
//                 }
//             };
//         });
//     }

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const privateIP = await getPrivateIP();
//             console.log(privateIP);
//             const response = await fetch('http://192.168.29.2:5000/api/user/login', {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ email, password})
//             });
//             const data = await response.json();
//             console.log('Response:', data);
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <form className='mx-5 my-5 w-50' onSubmit={handleSubmit}>
//             <div className="mb-3">
//                 <label htmlFor="inputEmail" className="form-label">Email address</label>
//                 <input
//                     type="email"
//                     className="form-control"
//                     id="inputEmail"
//                     aria-describedby="emailHelp"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
//             </div>
//             <div className="mb-3">
//                 <label htmlFor="inputPassword" className="form-label">Password</label>
//                 <input
//                     type="password"
//                     className="form-control"
//                     id="inputPassword"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//             </div>
//             <button type="submit" className="btn btn-primary">Submit</button>
//         </form>
//     );
// }

// export default Login;