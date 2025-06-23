import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import api from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-bootstrap/Spinner';
import '../styles/Auth.css';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

function Auth() {
  const { setAuthenticated } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [username, setUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSignIn(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const toggleForm = () => {setIsSignIn(prev => !prev)
    setLoginEmail('');
  setLoginPassword('');
  setUsername('');
  setRegisterEmail('');
  setRegisterPassword('');
  setConfirmPassword('');
  };

  const handleLogin = async () => {
    setLoadingLogin(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const token = await userCred.user.getIdToken();
      await api.post('/auth/sessionLogin', { token });
      setAuthenticated(true);
    } catch (err) {
      toast.error('Login failed');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleRegister = async () => {
  if (registerPassword !== confirmPassword) return toast.warn("Passwords don't match");;

  setLoadingRegister(true);

  try {
   
    const check = await api.get(`/auth/check-username/${username}`);
    if (check.data.exists) {
      toast.error("This username is already taken.");
      return;
    }

  
    const userCred = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
    await updateProfile(userCred.user, { displayName: username });

   
    await api.post('/auth/register', {
      uid: userCred.user.uid,
      username,
      email: registerEmail
    });

    toast.success("Registration successful! You can now log in.");
    setUsername('');
    setRegisterEmail('');
    setRegisterPassword('');
    setConfirmPassword('');
    setIsSignIn(true);

  } catch (err) {
    console.error(err);
    if (err.code === 'auth/email-already-in-use') {
      toast.error("This email is already registered.");
    } else if (err.response?.data?.message === 'Username already taken') {
       toast.error("This username is already taken.");
    } else {
      toast.error("Registration failed. Please try again.");
    }
  } finally {
    setLoadingRegister(false);
  }
};


  return (
    <div id="container" className={`auth-container ${isSignIn ? 'sign-in' : 'sign-up'}`}>
      <div className="auth-row">
       
        <div className="auth-col align-items-center flex-col sign-up">
          <div className="form-wrapper align-items-center">
            <div className="form sign-up">
              <div className="input-group">
                <i className='bx bxs-user'></i>
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <div className="input-group">
                <i className='bx bx-mail-send'></i>
                <input type="email" placeholder="Email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <i className='bx bxs-lock-alt'></i>
                <input type={showPass ? 'text' : 'password'} placeholder="Password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} />
                <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} onClick={() => setShowPass(!showPass)} className="fa-icon" />
              </div>
              <div className="input-group">
                <i className='bx bxs-lock-alt'></i>
                <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} onClick={() => setShowConfirm(!showConfirm)} className="fa-icon" />
              </div>
              <button onClick={handleRegister} disabled={loadingRegister}>
                {loadingRegister ? (
                  <>
                    <Spinner animation="border" size="sm" role="status" style={{ marginRight: '8px' }} />
                    Signing up...
                  </>
                ) : (
                  'Sign up'
                )}
              </button>
              <p>
                <span>Already have an account?</span><br />
                <b onClick={toggleForm} className="pointer">Sign in here</b>
              </p>
            </div>
          </div>
        </div>

        {/* Sign In Section */}
        <div className="auth-col align-items-center flex-col sign-in">
          <div className="form-wrapper align-items-center">
            <div className="form sign-in">
              <div className="input-group">
                <i className='bx bxs-user'></i>
                <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <i className='bx bxs-lock-alt'></i>
                <input type={showPass ? 'text' : 'password'} placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} onClick={() => setShowPass(!showPass)} className="fa-icon" />
              </div>
              <button onClick={handleLogin} disabled={loadingLogin}>
                {loadingLogin ? (
                  <>
                    <Spinner animation="border" size="sm" role="status" style={{ marginRight: '8px' }} />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
              <p>
                <span>Don't have an account?</span><br />
                <b onClick={toggleForm} className="pointer">Sign up here</b>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div className="auth-row auth-content-row">
        <div className="auth-col align-items-center flex-col">
          <div className="auth-text sign-in">
            <h2>Welcome</h2>
            <p>We're glad to have you back!</p>
          </div>
        </div>
        <div className="auth-col align-items-center flex-col">
          <div className="auth-text sign-up">
            <h2>Join with us</h2>
            <p>Create your account and start managing projects!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
