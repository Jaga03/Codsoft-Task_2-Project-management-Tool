import { useState } from "react";
import api from '../utils/api';
import '../styles/CreateTaskForm.css'
import { toast } from 'react-toastify';

export default function CreateTaskForm({ projectId, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedUsername, setAssignedUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      
      const res = await api.get(`/users/username/${assignedUsername}`);
      const assignedToUid = res.data.uid;
      const { data } = await api.post('/tasks', {
  projectId,
  title,
  description: desc,
  deadline,
  assignedUsername,
});

      onTaskCreated(data);
      toast.success('Task has been added to assigned user')
      setTitle('');
      setDesc('');
      setDeadline('');
      setAssignedUsername('');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task Title" required />
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" required />
      <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
      <input value={assignedUsername} onChange={e => setAssignedUsername(e.target.value)} placeholder="Assign to Username" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
