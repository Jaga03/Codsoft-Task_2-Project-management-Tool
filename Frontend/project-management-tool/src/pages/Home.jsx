import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import api from '../utils/api';

import CreateProjectForm from '../components/CreateProjectForm';
import ProjectList from '../components/ProjectList';
import ProjectDetails from '../ProjectDetails';
import UserProfile from '../components/UserProfile';
import DashboardChart from '../components/DashboardChart';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';

import '../styles/Home.css';

export default function Home() {
  const { logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [view, setView] = useState('projects');
  const [loadingProject, setLoadingProject] = useState(false);

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(res.data))
      .catch(() => toast.error('Failed to load projects'));
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };
  
  const handleSelectProject = (project) => {
    setLoadingProject(true);
    setTimeout(() => {
      setActiveProject(project);
      setLoadingProject(false);
    }, 500); 
  };


  return (
    <div className="home-container">
      <aside className="sidebar">
        <h1 className="sidebar-title">Dashboard</h1>
        <nav className="sidebar-nav">
          <button onClick={() => setView('projects')} className={view === 'projects' ? 'active' : ''}>
            Projects
          </button>
          <button onClick={() => setView('profile')} className={view === 'profile' ? 'active' : ''}>
            Profile
          </button>
          <button onClick={() => { setView('chart'); setActiveProject(null); }} className={view === 'chart' ? 'active' : ''}>
            Chart
          </button>
        </nav>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h2>
            {view === 'projects'
              ? (activeProject ? activeProject.name : 'Projects')
              : 'Profile'}
          </h2>
        </header>

        {view === 'projects' && !activeProject && !loadingProject && (
          <>
            <CreateProjectForm onCreated={handleProjectCreated} />
            <ProjectList
              projects={projects}
              onSelect={handleSelectProject}
              onProjectUpdate={(updated) => {
                setProjects(prev => prev.map(p => (p._id === updated._id ? updated : p)));
              }}
              onProjectDelete={(id) => {
                setProjects(prev => prev.filter(p => p._id !== id));
              }}
            />
          </>
        )}

        {view === 'projects' && loadingProject && (
          <div className="loading-center">
            <Spinner animation="border" className="custom-spinner"/>
          </div>
        )}

        {view === 'projects' && activeProject && !loadingProject && (
          <ProjectDetails project={activeProject} goBack={() => setActiveProject(null)} />
        )}

        {view === 'profile' && <UserProfile />}
        {view === 'chart' && <DashboardChart />}
      </main>
    </div>
  );
}
