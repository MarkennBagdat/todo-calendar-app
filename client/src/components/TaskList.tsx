import React, { useState } from 'react';
import { deleteTask, fetchTasks } from '../api/api.ts';

const TaskList: React.FC<{ selectedDate: string; tasks: any[]; setTasks: (tasks: any[]) => void; loading: boolean }> = ({ selectedDate, tasks, setTasks, loading }) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (taskId: string) => {
    if (confirmDelete !== taskId) return;

    try {
      await deleteTask(taskId);
      const updatedTasks = await fetchTasks(selectedDate); // Запрос на обновление списка задач
      setTasks(updatedTasks);
      setConfirmDelete(null);
    } catch (error) {
      console.error("Ошибка удаления задачи:", error);
    }
  };

  const handleConfirmDelete = (taskId: string) => {
    setConfirmDelete(taskId);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="task-container">
      <h3>Задачи на {selectedDate}</h3>
      {loading ? <p className="loading-text">Загрузка задач...</p> : null}
      <ul className={`task-list ${tasks.length === 0 ? 'empty' : ''}`}>
        {tasks.length === 0 ? (
          <li className="empty-message">Нет задач</li>
        ) : (
          tasks.map(task => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="list-checking">
                <input 
                  type="checkbox"
                  className="input_list" 
                  checked={task.completed} 
                  onChange={() => handleComplete(task.id)}
                />
                <span className="task-title">{task.title}</span>
              </div>
              
              <button onClick={() => handleConfirmDelete(task.id)} className="delete-button">Удалить</button>
            </li>
          ))
        )}
      </ul>

      {/* Модальное окно подтверждения удаления */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Вы точно хотите удалить задачу?</p>
            <div className="modal-actions">
              <button onClick={() => handleDelete(confirmDelete)} className="confirm-delete">Да</button>
              <button onClick={handleCancelDelete} className="cancel-delete">Нет</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
