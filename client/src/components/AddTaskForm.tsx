import React, { useState } from 'react';
import { addTask } from '../api/api.ts';

const AddTaskForm: React.FC<{ selectedDate: string; onTaskAdded: () => void }> = ({ selectedDate, onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Название задачи обязательно');
      return;
    }
    setIsLoading(true);
    try {
      await addTask({ title, date: selectedDate }); // Используем правильную дату
      setTitle('');
      setError('');
      onTaskAdded(); // Обновляем список задач
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`form_task ${isLoading ? 'loading' : ''}`}>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Введите название задачи" 
        required
        className={error ? 'input-error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
      <button type="submit" className={`add-button ${isLoading ? 'disabled' : ''}`} disabled={isLoading}>
        {isLoading ? 'Добавление...' : 'Добавить'}
      </button>
    </form>
  );
};

export default AddTaskForm;
