import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarView: React.FC<{ calendarData: Record<string, number>; setSelectedDate: (date: string) => void; selectedDate: string }> = ({ calendarData, setSelectedDate, selectedDate }) => {
  
  const handleDateClick = (date: Date) => {
    // Преобразуем дату в формат YYYY-MM-DD без учета часового пояса
    const formattedDate = date.toLocaleDateString('en-CA'); // en-CA = YYYY-MM-DD формат
    setSelectedDate(formattedDate);
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        onClickDay={handleDateClick}
        tileContent={({ date }) => {
          const dateString = date.toLocaleDateString('en-CA'); // en-CA = YYYY-MM-DD формат
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
