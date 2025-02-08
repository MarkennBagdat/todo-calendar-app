import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchCalendar } from '../api/api.ts';

const CalendarView: React.FC<{ setSelectedDate: (date: string) => void; selectedDate: string; refreshCalendar: boolean }> = ({ setSelectedDate, selectedDate, refreshCalendar }) => {
  const [calendarData, setCalendarData] = useState<Record<string, number>>({});

  // Функция для получения количества задач с сервера
  const fetchCalendarData = async () => {
    try {
      const data = await fetchCalendar();
      setCalendarData(data);
    } catch (error) {
      console.error('Ошибка загрузки календаря:', error);
    }
  };

  // Обновлять календарь при изменении даты или задач
  useEffect(() => {
    fetchCalendarData();
  }, [selectedDate, refreshCalendar]); // Добавлен refreshCalendar

  const handleDateClick = (date: Date) => {
    const formattedDate = date.toLocaleDateString('en-CA');
    setSelectedDate(formattedDate);
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        onClickDay={handleDateClick}
        tileContent={({ date }) => {
          const dateString = date.toLocaleDateString('en-CA');
          return calendarData[dateString] ? (
            <div className="task-dot">{calendarData[dateString]} tasks</div>
          ) : null;
        }}
        tileClassName={({ date }) => {
          const dateString = date.toLocaleDateString('en-CA');
          return dateString === selectedDate ? 'selected-tile' : '';
        }}
        value={selectedDate ? new Date(selectedDate) : new Date()}
      />
    </div>
  );
};

export default CalendarView;
