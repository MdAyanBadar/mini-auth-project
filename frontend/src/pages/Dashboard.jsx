import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`${API_URL}/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        dispatch(logout());
        navigate('/login');
        return;
      }

      const data = await response.json();
      setTickets(data.tickets);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tickets');
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

      if (response.ok) {
        fetchTickets(); // Refresh tickets
      }
    } catch (err) {
      console.error('Failed to resolve ticket', err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading tickets...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Welcome, {user?.name || 'User'}!</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {error && (
        <div style={styles.error}>{error}</div>
      )}

      <div style={styles.ticketsContainer}>
        <h2 style={styles.sectionTitle}>Support Tickets ({tickets.length})</h2>
        
        {tickets.length === 0 ? (
          <p style={styles.noTickets}>No tickets found</p>
        ) : (
          <div style={styles.ticketsList}>
            {tickets.map((ticket) => (
              <div key={ticket.id} style={styles.ticket}>
                <div style={styles.ticketHeader}>
                  <h3 style={styles.ticketTitle}>{ticket.title}</h3>
                  <span style={{
                    ...styles.status,
                    ...(ticket.status === 'resolved' ? styles.statusResolved : styles.statusOpen)
                  }}>
                    {ticket.status}
                  </span>
                </div>
                
                <p style={styles.ticketDesc}>{ticket.description}</p>
                
                <div style={styles.ticketFooter}>
                  <span style={styles.date}>
                    Created: {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                  
                  {ticket.status === 'open' && (
                    <button 
                      onClick={() => handleResolve(ticket.id)}
                      style={styles.resolveBtn}
                    >
                      Mark as Resolved
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

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  logoutBtn: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#666',
  },
  error: {
    maxWidth: '1200px',
    margin: '0 auto 20px',
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '4px',
  },
  ticketsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
  },
  noTickets: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#999',
  },
  ticketsList: {
    display: 'grid',
    gap: '16px',
  },
  ticket: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  ticketTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  status: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusOpen: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusResolved: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  ticketDesc: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
  },
  ticketFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #eee',
  },
  date: {
    fontSize: '12px',
    color: '#999',
  },
  resolveBtn: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default Dashboard;
