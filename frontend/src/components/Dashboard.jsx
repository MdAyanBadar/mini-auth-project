import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(logout());
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data.tickets);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (ticketId) => {
    try {
      const response = await fetch(`${API_URL}/tickets/${ticketId}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(logout());
          navigate('/login');
          return;
        }
        throw new Error('Failed to resolve ticket');
      }

      // Refresh tickets after resolving
      fetchTickets();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h2>Support Tickets</h2>
            <div className="user-info">
              Welcome, {user?.name} ({user?.email})
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>

        {loading && <div className="empty-state">Loading tickets...</div>}

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && tickets.length === 0 && (
          <div className="empty-state">
            <h3>No tickets found</h3>
            <p>There are currently no support tickets in the system.</p>
          </div>
        )}

        {!loading && !error && tickets.length > 0 && (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <h3 className="ticket-title">{ticket.title}</h3>
                  <span className={`ticket-status ${ticket.status}`}>
                    {ticket.status}
                  </span>
                </div>

                {ticket.description && (
                  <p className="ticket-description">{ticket.description}</p>
                )}

                <div className="ticket-meta">
                  <div>
                    <div>Created by: {ticket.user_name || 'Unknown'}</div>
                    <div>Date: {formatDate(ticket.created_at)}</div>
                    {ticket.resolved_at && (
                      <div>Resolved: {formatDate(ticket.resolved_at)}</div>
                    )}
                  </div>

                  {ticket.status === 'open' && (
                    <button
                      onClick={() => handleResolve(ticket.id)}
                      className="btn-resolve"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
