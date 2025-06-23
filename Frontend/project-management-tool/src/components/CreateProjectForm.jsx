import { useState } from 'react';
import api from '../utils/api';
import '../styles/ProjectStyles.css';
import { toast } from 'react-toastify';

export default function CreateProjectForm({ onCreated }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/projects', { name, description: desc });
    setName('');
    setDesc('');
    onCreated(data);
    toast.success('Project has been created')
  };

  return (
    <form className="create-project-form" onSubmit={submit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Project Name" required />
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" required />
      <button type="submit">Create Project</button>
    </form>
  );
}
