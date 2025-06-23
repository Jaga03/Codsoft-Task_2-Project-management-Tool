import { useEffect, useState } from 'react';
import CreateTaskForm from './components/CreateTaskForm';
import TaskBoard from './components/TaskBoard';
import api from './utils/api';
import './ProjectDetails.css';
import { toast } from 'react-toastify';

export default function ProjectDetails({ project, goBack }) {
  const [refreshTasks, setRefreshTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignedUserName, setAssignedUserName] = useState('');
  const [status, setStatus] = useState('');

  const handleTaskCreated = () => {
    setRefreshTasks(prev => !prev); 
  };

  const handleStatusChange = async () => {
    try {
      await api.put(`/tasks/${selectedTask._id}`, { status });
      toast.success('Status updated');
      setRefreshTasks(prev => !prev);
      setSelectedTask(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    const fetchAssignedUserName = async () => {
      if (selectedTask?.assignedTo) {
        try {
          const res = await api.get(`/users/${selectedTask.assignedTo}`);
          setAssignedUserName(res.data.name);
        } catch {
          setAssignedUserName('(Name not found)');
        }
      }
    };
    fetchAssignedUserName();
    setStatus(selectedTask?.status || '');
  }, [selectedTask]);

  return (
    <div className="project-details">
      <div className="header">
        <button onClick={goBack} className="btn-back">← Back to Projects</button>
        <h2>{project.name}</h2>
        <p>{project.description}</p>
      </div>

      <div className="section">
        <h3>Create Task</h3>
        <CreateTaskForm projectId={project._id} onTaskCreated={handleTaskCreated} />
      </div>

      <div className="section">
        <h3>Task Board</h3>
        <TaskBoard
          projectId={project._id}
          onSelectTask={setSelectedTask}
          refreshTrigger={refreshTasks}
        />
      </div>

      {selectedTask && (
        <div className="section-selected">
          <h4>Selected Task</h4>
          <p><strong>Title:</strong> {selectedTask.title}</p>
          <p><strong>Description:</strong> {selectedTask.description}</p>
          <p><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {selectedTask.status}</p>
          <p><strong>Assigned To:</strong> {assignedUserName}</p>

          
          {selectedTask?.createdBy && project.owner === selectedTask.createdBy && (
  <>
   <div className="status-update">
  <label><strong>Update Status:</strong></label>
  <div className="status-update-controls">
    <select value={status} onChange={e => setStatus(e.target.value)}>
      <option value="Pending">Pending</option>
      <option value="Progress">Progress</option>
      <option value="Completed">Completed</option>
    </select>
    <div>
    <button className="update-btn" onClick={handleStatusChange}>Update</button>
    </div>
  </div>
</div>
  </>
)}
        </div>
      )}
    </div>
  );
}
