import React, { useState, useEffect } from 'react';
import axios from '../helper/Axios';
import { Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import SiderBar2 from '../Components/SiderBar2';
import './Allusers.css';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
        JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
    );
    const token = localStorage.getItem('token');

    // Monitor sidebar collapse state
    useEffect(() => {
        const checkSidebarState = () => {
            const sidebarState = JSON.parse(localStorage.getItem("sidebarCollapsed")) || false;
            setIsSidebarCollapsed(sidebarState);
        };

        checkSidebarState();
        window.addEventListener('storage', checkSidebarState);
        window.addEventListener('sidebarChange', (e) => setIsSidebarCollapsed(e.detail.isCollapsed));
        
        return () => {
            window.removeEventListener('storage', checkSidebarState);
            window.removeEventListener('sidebarChange', (e) => setIsSidebarCollapsed(e.detail.isCollapsed));
        };
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/get_all_users/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    const handleEditClick = async (user) => {
        const { value: newUserType } = await Swal.fire({
            title: 'Update User Type',
            input: 'text',
            inputValue: user.user_type,
            showCancelButton: true,
            confirmButtonText: 'Update',
            inputValidator: (value) => !value && 'User type is required',
        });
        if (newUserType) {
            try {
                await axios.put('/api/update_user_type/', { user_id: user.user_id, user_type: newUserType });
                setUsers(users.map((u) => (u.user_id === user.user_id ? { ...u, user_type: newUserType } : u)));
                Swal.fire('Success', 'User type updated!', 'success');
            } catch {
                Swal.fire('Error', 'Failed to update user type', 'error');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'This user will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });
        if (confirmDelete.isConfirmed) {
            try {
                await axios.delete(`/api/delete_user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
                setUsers(users.filter((user) => user.user_id !== userId));
                Swal.fire('Deleted!', 'User has been deleted.', 'success');
            } catch {
                Swal.fire('Error', 'Failed to delete user', 'error');
            }
        }
    };

    return (
        <div className="flex h-screen">
            <SiderBar2 />
            <div className={`admin-content ${isSidebarCollapsed ? 'admin-content-collapsed' : ''} bg-white text-black px-4 py-6 relative`}>
                {loading ? (
                    <div className="absolute top-0 left-8 right-0 bottom-0 flex flex-col justify-center items-center bg-white bg-opacity-80 z-10">
                        <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-blue-900 font-medium">Loading users...</p>
                    </div>
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-hidden w-full">
                        <div className="bg-blue-900 text-white px-6 py-4 flex justify-between rounded-t-lg items-center user">
                            <h2 className="text-2xl font-bold">User List</h2>
                            <Link
                                to="/hr_register"
                                className="px-4 py-2 bg-white text-black rounded-lg font-bold list"
                            >
                                Register HR
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b whitespace-nowrap">
                                    <tr>
                                        {[
                                            "Username",
                                            "Email",
                                            "User Type",
                                            "Phone No",
                                            "Company",
                                            "Industry",
                                            "Actions",
                                        ].map((head) => (
                                            <th
                                                key={head}
                                                className="px-6 py-4 text-left text-md font-medium text-gray-600 uppercase"
                                            >
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.user_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-gray-900">{user.username}</td>
                                            <td className="px-6 py-4 text-blue-600">
                                                <a href={`mailto:${user.email}`}>{user.email}</a>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{user.user_type}</td>
                                            <td className="px-6 py-4 text-gray-500">{user.phone_no}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {user.company || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {user.industry || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 flex gap-3 items-center">
                                                <button
                                                    className="px-3 py-1 bg-blue-900 text-white rounded-lg mr-2"
                                                    onClick={() => handleEditClick(user)}
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg"
                                                    onClick={() => handleDeleteUser(user.user_id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {users.length === 0 && (
                            <div className="text-center py-6 text-gray-500">No users found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllUsers;