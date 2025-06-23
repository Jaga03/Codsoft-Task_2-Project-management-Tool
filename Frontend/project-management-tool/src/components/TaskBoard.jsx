import { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/TaskBoard.css';
import { toast } from 'react-toastify';

const statuses = ['Pending', 'Progress', 'Completed'];

export default function TaskBoard({ projectId, onSelectTask, refreshTrigger }) {
  const [columns, setColumns] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/tasks/assigned/me');
        const sorted = { Pending: [], Progress: [], Completed: [] };
        data
          .filter(task => task.projectId === projectId)
          .forEach(task => {
            const status = task.status || 'Pending';
            sorted[status].push(task);
          });
        setColumns(sorted);
      } catch (err) {
        toast.error('Failed to load tasks');
      }
    })();
  }, [projectId, refreshTrigger]); 

  return (
    <div className="task-board">
      {statuses.map(status => (
        <div key={status} className="task-column">
          <h4>{status}</h4>
          {(columns[status] || []).map(task => (
            <div
              key={task._id}
              className="task-card"
              onClick={() => onSelectTask?.(task)}
            >
              <div className="task-card-header">
    <h5>{task.title}</h5>
    <span className={`badge badge-${task.status.toLowerCase()}`}>
      {task.status}
    </span>
  </div>
  <small>Due: {new Date(task.deadline).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
