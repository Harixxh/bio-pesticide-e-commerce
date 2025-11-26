import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../Auth.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await adminLogin(email, password);

    if (result.success) {
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Admin Login</h1>
        <p className="auth-subtitle">Access the admin dashboard</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter admin email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        {/* <div className="admin-credentials-hint">
          <p><small>Default credentials: admin@pesticide.com / admin123</small></p>
        </div> */}
      </div>
    </div>
  );
};

export default AdminLogin;
