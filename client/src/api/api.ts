import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

export interface Task {
  id: number;
  title: string;
  date: string;
  completed: boolean;
}

export interface NewTask {
  title: string;
  date: string;
}

// Получение задач на определенную дату
export const fetchTasks = async (date: string): Promise<Task[]> => {
  const response = await axios.get(`${API_BASE_URL}/tasks`, { params: { date } });
  return response.data;
};

// Добавление новой задачи
export const addTask = async (task: NewTask): Promise<Task> => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, {
    title: task.title.trim(),
    date: task.date,
    completed: false, // добавляем значение по умолчанию
  });

  return response.data;
};

// Удаление задачи + обновление календаря
export const deleteTask = async (taskId: number, refreshCalendar: () => void): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
  refreshCalendar(); // Обновление календаря после удаления задачи
};

// Получение данных календаря
export const fetchCalendar = async (): Promise<Record<string, number>> => {
  const response = await axios.get(`${API_BASE_URL}/calendar`);
  return response.data;
};

// Обновление статуса задачи (выполнено/не выполнено)
export const updateTaskStatus = async (id: number, completed: boolean): Promise<Task> => {
  console.log("Отправка запроса на сервер:", { id, completed });

  const response = await axios.patch(`${API_BASE_URL}/tasks/${id}`, { completed });

  return response.data;
};
