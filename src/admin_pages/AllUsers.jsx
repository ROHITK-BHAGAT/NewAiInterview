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
    const token = localStorage.getItem('token');

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

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin h-16 w-16 border-t-4 border-blue-600"></div></div>;

    return (
        <div className="flex">
        {/* Sidebar - 20% width */}
        <div className="w-1/6">
    <SiderBar2 />
  </div>
        {/* Main Content - 80% width */}
        <div className="ml-72 flex-grow p-6 bg-white text-black margin">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <div className="bg-blue-900 text-white px-6 py-4 flex justify-between rounded-lg items-center user">
              <h2 className="text-2xl font-bold ">User List</h2>
              <Link
                to="/hr_register"
                className="px-4 py-2 bg-white text-black rounded-lg font-bold list"
              >
                Register HR
              </Link>
            </div>
  
            <div className="overflow-x-auto ">
              <table className="w-full ">
                <thead className="bg-gray-100 border-b ">
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
                        className="px-6 py-4 text-left text-md font-medium text-gray-600 uppercase list"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 ">
                  {users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-50 ">
                      <td className="px-6 py-4 text-gray-900 list">{user.username}</td>
                      <td className="px-6 py-4 text-blue-600 list">
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </td>
                      <td className="px-6 py-4 text-gray-500 list">{user.user_type}</td>
                      <td className="px-6 py-4 text-gray-500 list">{user.phone_no}</td>
                      <td className="px-6 py-4 text-gray-500 list">
                        {user.company || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-500 list">
                        {user.industry || "N/A"}
                      </td>
                      <td className="px-6 py-4 flex gap-3 items-center list">
                        <button
                          className="px-3 py-1 bg-blue-900 text-white rounded-lg mr-2 list"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded-lg list "
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
        </div>
      </div>
    );
};

export default AllUsers;