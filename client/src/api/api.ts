const API_BASE_URL: string = 'http://localhost:4000';

export interface Task {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export interface NewTask {
  title: string;
  date: string;
}

// Экспортируем отдельные функции
export const fetchTasks = async (date: string): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/tasks?date=${date}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

export const addTask = async (task: NewTask): Promise<Task> => {
  console.log("Отправляем задачу:", task); // Логируем перед отправкой

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Получаем текст ошибки
    console.error(`Ошибка сервера: ${errorText}`);
    throw new Error(`Failed to create task: ${response.statusText}`);
  }

  return response.json();
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete task: ${response.statusText}`);
    }
    console.log(`Task ${id} deleted successfully`);
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error);
  }
};


export const fetchCalendar = async (): Promise<Record<string, number>> => {
  const response = await fetch(`${API_BASE_URL}/calendar`);
  if (!response.ok) {
    throw new Error('Failed to fetch calendar data');
  }
  return response.json();
};