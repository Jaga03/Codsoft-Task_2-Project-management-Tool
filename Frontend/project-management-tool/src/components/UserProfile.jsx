import { useEffect, useState } from 'react';
import api from '../utils/api';
import { auth } from '../firebase';
import ChangePassword from './ChangePassword';
import '../styles/UserProfile.css';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';


export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.currentUser.getIdToken().then(token => {
      api.get(`/users/${auth.currentUser.uid}`)
        .then(res => setUser(res.data))
        .catch(() => toast.error('Failed to fetch user info'));
    });
  }, []);

  if (!user) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" className="custom-spinner" />
      </div>
    );
  }

  return (
    <div className="profile-section">
      <h3>Details</h3>
      <p><strong>Name:</strong> {user.name || 'Not set'}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <ChangePassword />
    </div>
  );
}
