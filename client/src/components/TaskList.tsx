import React, { useState, useEffect } from "react";
import { Task, deleteTask } from "../api/api.ts";

interface TaskListProps {
  selectedDate: string;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  loading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ selectedDate, tasks, setTasks, loading }) => {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);


// Изначально я хотела использовать PUT/PATCH-запрос к серверу для обновления статуса задачи,
// но сервер не поддерживает изменение задачи (нет соответствующего API-эндпоинта).
// Рассматривала вариант удаления задачи (DELETE) и её повторного добавления (POST) с обновлённым completed,
// но тогда статус задачи (completed) всегда сбрасывался бы в false, что неудобно.
// Временно реализовала обновление статуса через локальное состояние и localStorage.
// Теперь после обновления страницы задачи остаются "Выполнено".
// Всё работает на клиенте (React), без необходимости изменять сервер.
// Однако, в будущем для безопасности лучше использовать PUT/PATCH, чтобы изменения сохранялись на бэке.
  
useEffect(() => {
    const savedCompletedTasks = localStorage.getItem("completedTasks");
    if (savedCompletedTasks) {
      const completedTasks = JSON.parse(savedCompletedTasks);
      const updatedTasks = tasks.map(task => ({
        ...task,
        completed: completedTasks.includes(task.id),
      }));
      setTasks(updatedTasks);
    }
  }, [selectedDate, setTasks, tasks]);

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);

      // Удаляем из localStorage
      const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]");
      const newCompletedTasks = completedTasks.filter((id: number) => id !== taskId);
      localStorage.setItem("completedTasks", JSON.stringify(newCompletedTasks));

      setConfirmDelete(null);
    } catch (error) {
      console.error("Ошибка удаления задачи:", error);
    }
  };

  const handleComplete = (id: number) => {
    try {
      const updatedTasks = tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      setTasks(updatedTasks);

      // Сохраняем выполненные задачи в localStorage
      const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]");
      if (updatedTasks.find(task => task.id === id)?.completed) {
        localStorage.setItem("completedTasks", JSON.stringify([...completedTasks, id]));
      } else {
        const newCompletedTasks = completedTasks.filter((taskId: number) => taskId !== id);
        localStorage.setItem("completedTasks", JSON.stringify(newCompletedTasks));
      }
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    });
  };

  return (
    <div className="task-container">
      <h3>Задачи на {formatDate(selectedDate)}</h3>
      {loading ? (
        <p className="loading-text">Загрузка задач...</p>
      ) : (
        <ul className={`task-list ${tasks.length === 0 ? "empty" : ""}`}>
          {tasks.length === 0 ? (
            <li className="empty-message">Нет задач</li>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className={`task-item ${task.completed ? "completed" : "active"}`}>
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleComplete(task.id)}
                    className="task-checkbox"
                  />
                  <span className={`task-title ${task.completed ? "completed-text" : ""}`}>
                    {task.title}
                  </span>
                  <span className={`task-status ${task.completed ? "status-done" : "status-active"}`}>
                    {task.completed ? "Выполнено" : "Активно"}
                  </span>
                </div>
                <div className="task-actions">
                  <button onClick={() => setConfirmDelete(task.id)} className="delete-button">
                    Удалить
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      {/* Модальное окно подтверждения удаления */}
      {confirmDelete !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Вы уверены?</h3>
            <p>Эту задачу нельзя будет восстановить.</p>
            <div className="modal-actions">
              <button onClick={() => handleDelete(confirmDelete)} className="confirm-delete">
                Удалить
              </button>
              <button onClick={() => setConfirmDelete(null)} className="cancel-delete">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
