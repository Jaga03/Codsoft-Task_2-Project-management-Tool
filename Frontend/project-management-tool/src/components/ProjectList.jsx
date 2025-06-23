import { useState } from 'react';
import api from '../utils/api';
import ConfirmModal from './ConfirmModal';
import '../styles/ProjectStyles.css';
import { toast } from 'react-toastify';

export default function ProjectList({ projects, onSelect, onProjectUpdate, onProjectDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const handleEdit = (project) => {
    setEditingId(project._id);
    setEditName(project.name);
    setEditDesc(project.description);
  };

  const handleUpdate = async (id) => {
    try {
      const { data } = await api.put(`/projects/${id}`, {
        name: editName,
        description: editDesc
      });
      onProjectUpdate(data);
      toast.success('Project updated successfully');
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      onProjectDelete(id);
      toast.success('Project and tasks deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <>
      <div className="project-list">
        {projects.map(p => (
          <div key={p._id} className="project-card">
            {editingId === p._id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Project Name"
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Description"
                />
                <div className="project-actions">
                  <button onClick={() => handleUpdate(p._id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h4 onClick={() => onSelect(p)}>{p.name}</h4>
                <p onClick={() => onSelect(p)}>{p.description}</p>
                <div className="project-actions">
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => setConfirmId(p._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

  
      {confirmId && (
        <ConfirmModal
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone."
          onCancel={() => setConfirmId(null)}
          onConfirm={() => handleDelete(confirmId)}
        />
      )}
    </>
  );
}
