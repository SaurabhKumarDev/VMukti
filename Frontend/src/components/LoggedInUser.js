// import React, { useState, useEffect } from 'react';

// function LoggedInUser() {
//     const [userData, setUserData] = useState([]);

//     useEffect(() => {
//         const fetchLoggedInUser = async () => {
//             try {
//                 const response = await fetch("http://localhost:5000/api/user/loginfo", {
//                     method: "GET",
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Auth-Token': localStorage.getItem("token")
//                     }
//                 });
//                 if (response.ok) {
//                     const data = await response.json();
//                     setUserData(data.LoggedInUser);
//                     console.log(data);
//                 } else {
//                     console.error("Failed to fetch data");
//                 }
//             } catch (error) {
//                 console.error("Error:", error);
//             }
//         };

//         fetchLoggedInUser();
//     }, []);

//     const handleLogout = async (userId) => {
//         try {
//             const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
//                 method: "DELETE",
//                 headers: {
//                     'Auth-Token': localStorage.getItem('token')
//                 }
//             });
//             if (response.ok) {
//                 // Update state to remove the logged out user from the table
//                 setUserData(userData.filter(user => user._id !== userId));
//             } else {
//                 console.error("Failed to log out");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     }

//     return (
//         localStorage.getItem('token') ?
//         <div className="container mt-5">
//             <h2 className="text-center mb-4">Multiple user login information</h2>
//             <table className="table table-striped table-bordered">
//                 <thead className="thead-dark">
//                     <tr>
//                         <th scope="col">Browser</th>
//                         <th scope="col">Platform</th>
//                         <th scope="col">Session ID</th>
//                         <th scope="col">Status</th>
//                         <th scope="col">LogIn Time</th>
//                         <th scope='col'>LogOut Time</th>
//                         <th scope="col">LogOut</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {userData.length > 0 ? (
//                         userData.map((user, index) => (
//                             <tr key={index}>
//                                 <td>{user.browser}</td>
//                                 <td>{user.platform}</td>
//                                 <td>{user.session_id}</td>
//                                 <td>{user.status}</td>
//                                 <td>{user.login_time}</td>
//                                 <td>{user.logout_time ? user.logout_time : "Null"}</td>
//                                 <td className='text-success' style={{ cursor: 'pointer' }} onClick={() => handleLogout(user._id)}>Log out</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="6" className="text-center">No data available</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//         :
//         <div>You should have to log in yourself first then access this page</div>
//     );
// }

// export default LoggedInUser;