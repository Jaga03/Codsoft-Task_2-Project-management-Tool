import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

const AppRoutes = () => {
  const { authenticated, loading } = useAuth();

 if (loading) return <LoadingSpinner />;

  return (
    <Routes>
      <Route path="/" element={authenticated ? <Navigate to="/home" /> : <Auth />} />
      <Route path="/home" element={authenticated ? <Home /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to={authenticated ? "/home" : "/"} />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
