import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import api from '../../utils/api';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      const { data } = await api.delete(`/admin/users/${userId}`);
      if (data.success) {
        setUsers(users.filter((user) => user._id !== userId));
        toast.success('User deleted successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-users">
      <div className="container">
        <h1>Registered Users</h1>

        {error && <p className="error-message">{error}</p>}

        {users.length === 0 ? (
          <div className="no-users">
            <p>No users found.</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>
                      <span className={`status-badge ${user.isEmailVerified ? 'verified' : 'unverified'}`}>
                        {user.isEmailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="users-stats">
          <p>Total Users: <strong>{users.length}</strong></p>
          <p>
            Verified Users:{' '}
            <strong>{users.filter((u) => u.isEmailVerified).length}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
