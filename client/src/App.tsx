import React, { useState, useEffect } from 'react';
import CalendarView from './components/CalendarView.tsx';
import TaskList from './components/TaskList.tsx';
import AddTaskForm from './components/AddTaskForm.tsx';
import { fetchCalendar, fetchTasks } from './api/api.ts';
import './assets/styles/style.css';
import 'react-calendar/dist/Calendar.css';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [calendarData, setCalendarData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCalendar().then(setCalendarData);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      fetchTasks(selectedDate).then(data => {
        setTasks(data);
        setLoading(false);
      });
    }
  }, [selectedDate]);

  const refreshTasks = () => {
    fetchTasks(selectedDate).then(setTasks);
  };

  return (
    <div className="container">
      <h1>ToDo Calendar</h1>
      <CalendarView 
        calendarData={calendarData} 
        setSelectedDate={setSelectedDate} 
        selectedDate={selectedDate} // Теперь передаем правильную дату
      />
      <AddTaskForm 
        selectedDate={selectedDate} 
        onTaskAdded={refreshTasks} 
      />
      <TaskList 
        tasks={tasks} 
        setTasks={setTasks} 
        selectedDate={selectedDate} 
        loading={loading} 
      />
    </div>
  );
};

export default App;
