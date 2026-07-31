import { useEffect, useState } from 'react';
import { suggestDescription } from '../services/aiService';
import toast from '../services/toast';

const emptyTask = {
  title: '',
  description: '',
  status: 'To Do',
  priority: 'Medium',
  dueDate: ''
};

function TaskModal({ task, initialStatus = 'To Do', onClose, onSave }) {
  const [formData, setFormData] = useState(emptyTask);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
      });
    } else {
      setFormData({ ...emptyTask, status: initialStatus });
    }
  }, [task, initialStatus]);

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(formData);
  }

  async function handleGenerate() {
    const sourceText = formData.description || formData.title;

    if (!sourceText.trim()) {
      toast.error('Add a title or description first');
      return;
    }

    try {
      setGenerating(true);
      const data = await suggestDescription(sourceText);
      setFormData((current) => ({ ...current, description: data.result }));
      toast.success('AI Generated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'AI generation failed');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="task-modal">
        <div className="modal-header">
          <h3>{task ? 'Edit Task' : 'Create Task'}</h3>
          <button onClick={onClose}>Close</button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <label>
            Title
            <input name="title" value={formData.title} onChange={handleChange} required />
          </label>

          <label>
            <span className="label-row">
              Description
              <button className="text-action" type="button" onClick={handleGenerate} disabled={generating}>
                {generating ? 'Generating...' : 'Generate with AI'}
              </button>
            </span>
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>

          <div className="form-row">
            <label>
              Status
              <select name="status" value={formData.status} onChange={handleChange}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Review</option>
                <option>Completed</option>
              </select>
            </label>

            <label>
              Priority
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
          </div>

          <label>
            Due Date
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
          </label>

          <button className="primary-btn" type="submit">
            {task ? 'Save Changes' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
