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
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [setTasks]);

  const handleDelete = async (taskId: number) => {
    if (confirmDelete !== taskId) return;

    try {
      await deleteTask(taskId);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Сохраняем обновленный список
      setConfirmDelete(null);
    } catch (error) {
      console.error("Ошибка удаления задачи:", error);
    }
  };

  const handleComplete = (id: number, title: string, date: string, completed: boolean) => {
    try {
      const updatedTasks = tasks.map((t) =>
        t.id === id ? { ...t, completed } : t
      );

      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Сохраняем в localStorage
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
              <li
                key={task.id}
                className={`task-item ${task.completed ? "completed" : "active"}`}
              >
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      handleComplete(task.id, task.title, task.date, !task.completed)
                    }
                    className="task-checkbox"
                  />
                  <span className={`task-title ${task.completed ? "completed-text" : ""}`}>
                    {task.title}
                  </span>
                  <span
                    className={`task-status ${task.completed ? "status-done" : "status-active"}`}
                  >
                    {task.completed ? "Выполнено" : "Активно"}
                  </span>
                </div>
                <div className="task-actions">
                  {confirmDelete === task.id ? (
                    <>
                      <button onClick={() => handleDelete(task.id)} className="confirm-delete">
                        Подтвердить
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="cancel-delete">
                        Отмена
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmDelete(task.id)} className="delete-button">
                      Удалить
                    </button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default TaskList;