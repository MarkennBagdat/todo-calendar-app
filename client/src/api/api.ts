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

// Экспортируем отдельные функции
export const fetchTasks = async (date: string): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/tasks?date=${date}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

export const addTask = async (task: NewTask): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: task.title.trim(),
      date: task.date,
      completed: false // добавляем значение по умолчанию
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
};

export const deleteTask = async (taskId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
};

export const fetchCalendar = async (): Promise<Record<string, number>> => {
  const response = await fetch(`${API_BASE_URL}/calendar`);
  if (!response.ok) {
    throw new Error('Failed to fetch calendar data');
  }
  return response.json();
};

export const updateTaskStatus = async (
  id: number,
  title: string,
  date: string,
  completed: boolean
): Promise<Task> => {
  console.log("Отправка запроса на сервер:", { id, title, date, completed });

  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, title, date, completed }),
  });
  

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Ошибка обновления задачи: ${response.status}, ${errorText}`);
    throw new Error(`Failed to update task status`);
  }

  return response.json();
};
