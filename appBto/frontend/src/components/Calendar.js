import React, { useState, useEffect } from 'react';
import { calendarAPI } from '../services/api';

const Calendar = ({ role }) => {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await calendarAPI.getSchedules({ role });
        setSchedules(response.data);
      } catch (err) {
        if (err.response) {
          // Server responded with a status other than 2xx
          setError(`Error: ${err.response.status} - ${err.response.statusText}`);
        } else if (err.request) {
          // Request was made, but no response was received
          setError('Error: No response from the server.');
        } else {
          // Something else happened
          setError(`Error: ${err.message}`);
        }
      }
    };

    fetchSchedules();
  }, [role]);

  return (
    <div>
      <h2>Calendar</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="calendar">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="calendar-day">
            <p>Date: {schedule.scheduled_date}</p>
            <p>Time: {schedule.start_time} - {schedule.end_time}</p>
            <p>Status: {schedule.status}</p>
            {role === 'ADMIN' && <button>Edit</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
