import React, { useState, useEffect } from 'react';
import { addTask } from '../api/api.ts';

const AddTaskForm: React.FC<{ selectedDate: string; setSelectedDate: (date: string) => void; onTaskAdded: () => void }> = ({ selectedDate, setSelectedDate, onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // При изменении даты в календаре, обновляем поле ввода
  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация перед отправкой
    if (!title.trim()) {
      setError('Название задачи обязательно');
      return;
    }
    if (!date) {
      setError('Дата выполнения обязательна');
      return;
    }

    setIsLoading(true);
    try {
      await addTask({ title, date });
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
        className={error && !title ? 'input-error' : ''}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          setSelectedDate(e.target.value); // Синхронизация с календарем
        }}
        required
        className={error && !date ? 'input-error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
      <button type="submit" className={`add-button ${isLoading ? 'disabled' : ''}`} disabled={isLoading}>
        {isLoading ? 'Добавление...' : 'Добавить'}
      </button>
    </form>
  );
};

export default AddTaskForm;
