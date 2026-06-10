import React, { useState, useEffect } from 'react';
import { getAllUsers, toggleBlockUser } from '../../services/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchUsersList = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      applyFilter(data, activeFilter);
    } catch (err) {
      console.error('Error fetching user directories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  const applyFilter = (data, filter) => {
    if (filter === 'all') {
      setFilteredUsers(data);
    } else {
      setFilteredUsers(data.filter((u) => u.role?.toLowerCase() === filter));
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilter(users, filter);
  };

  const handleToggleBlock = async (userId) => {
    try {
      await toggleBlockUser(userId);
      await fetchUsersList();
    } catch (err) {
      console.error('Error toggling block state:', err);
    }
  };

  return (
    <div className="animate-fade-in text-white pb-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-20 text-info px-3 py-2 rounded-pill small mb-2 text-uppercase tracking-wider">Administration</span>
        <h1 className="display-6">User Account Directory</h1>
        <p className="text-muted">Audit user databases, configure access permissions, and toggle account suspensions</p>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex justify-content-center gap-2 mb-4">
        {['all', 'customer', 'worker', 'admin'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleFilterChange(tab)}
            className={`btn btn-sm text-capitalize ${
              activeFilter === tab ? 'btn-gradient-primary' : 'btn-glass text-muted'
            }`}
            style={{ borderRadius: '20px', padding: '0.45rem 1.2rem' }}
          >
            {tab}s
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="card glass-card border-0 p-4">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-5 text-muted small">
            No platform accounts match this filter.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table custom-table mb-0">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Contact Email</th>
                  <th>System Role</th>
                  <th>Base Address</th>
                  <th className="text-end">Suspension Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="fw-semibold text-white">{u.name}</div>
                      <div className="small text-muted">{u.phone || 'No phone number'}</div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${
                        u.role?.toLowerCase() === 'admin' ? 'bg-danger text-white' : u.role?.toLowerCase() === 'worker' ? 'bg-info text-dark' : 'bg-secondary text-white'
                      } px-2 py-1 text-uppercase small`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className="small text-muted">{u.address || 'N/A'}</span>
                    </td>
                    <td className="text-end">
                      {u.role === 'admin' ? (
                        <span className="text-muted small">Protected Account</span>
                      ) : (
                        <button
                          onClick={() => handleToggleBlock(u.id)}
                          className={`btn btn-sm ${u.blocked ? 'btn-success bg-opacity-25' : 'btn-outline-danger'}`}
                          style={{ minWidth: '100px' }}
                        >
                          {u.blocked ? 'Unblock' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
