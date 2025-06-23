import { useState } from 'react';
import { auth } from '../firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import api from '../utils/api';
import { useAuth } from '../Context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-bootstrap/Spinner';
import '../styles/ChangePassword.css';
import { toast } from 'react-toastify';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuthenticated } = useAuth();

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('User not logged in');
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      toast.success('Password updated. Please log in again.');
      await api.post('/auth/logout');
      setAuthenticated(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update password. Please check current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', position: 'relative' }}>
      <h3>Change Password</h3>

      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <input
          type={showCurrent ? 'text' : 'password'}
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={{ width: '100%', padding: '0.5rem 2.5rem 0.5rem 0.5rem' }}
        />
        <FontAwesomeIcon
          icon={showCurrent ? faEyeSlash : faEye}
          onClick={() => setShowCurrent(!showCurrent)}
          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
        />
      </div>

      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <input
          type={showNew ? 'text' : 'password'}
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: '100%', padding: '0.5rem 2.5rem 0.5rem 0.5rem' }}
        />
        <FontAwesomeIcon
          icon={showNew ? faEyeSlash : faEye}
          onClick={() => setShowNew(!showNew)}
          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
        />
      </div>

      <button
        onClick={handleChangePassword}
        style={{ padding: '0.5rem 1rem', width: '100%' }}
        disabled={loading} className='update-btn'
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" role="status" style={{ marginRight: '0.5rem' }} />
            Updating...
          </>
        ) : (
          'Update Password'
        )}
      </button>
    </div>
  );
}
